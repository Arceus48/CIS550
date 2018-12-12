const handleInformation = (connection) => (req, res) => {
    const { name, business_id } = req.body;
    const queryGeneralInfo = ` 
                    SELECT * FROM restaurant r
                    JOIN yelp_business y ON r.business_id = y.business_id 
                    WHERE r.restaurant_name = "${name}";
                    `
    const queryReviews =  `
                    SELECT stars, COUNT(*) AS count FROM restaurant r
                    JOIN yelp_review yr ON r.business_id = yr.business_id
                    WHERE r.restaurant_name = "${name}"
                    GROUP BY stars 
                    ORDER BY stars DESC;
                    `
    const queryViolations = `
                    SELECT c.violation_id, c.violation_description
                    FROM violations v 
                    JOIN (  SELECT serial_number FROM restaurant r
                            JOIN inspection_record i ON r.restaurant_name = i.restaurant_name
                            WHERE r.restaurant_name = "${name}"
                            ORDER BY inspection_time DESC
                            LIMIT 1) AS s ON v.serial_number = s.serial_number
                    JOIN violation_code c ON c.violation_id = v.violations;
                    `
    const queryPhoto = `
                    SELECT photo_id
                    FROM yelp_photo
                    WHERE business_id = "${business_id}";
                    `
    const queryInspection = `
                    SELECT inspection_date, current_grade
                    FROM inspection_record 
                    WHERE restaurant_name = "${name}" 
                    ORDER BY inspection_date DESC 
                    LIMIT 1;
                    `
    const queryCategory = `
                    SELECT category
                    FROM yelp_category
                    WHERE business_id = "${business_id}";
                    `
    const query = queryGeneralInfo + queryReviews + queryViolations + queryPhoto + queryInspection + queryCategory;
    connection.query(query, [1, 2, 3, 4, 5, 6], (err, rows, fields) => {
        if(err){
            console.log("An error ocurred performing the query.");
            res.json("error");
        }
        else {
            const results = {
                generalInfo : rows[0],
                reviews : rows[1],
                violations : rows[2],
                photos : rows[3],
                inspection: rows[4],
                category: rows[5],
            }
            res.json(results);
        }
    });
}



module.exports = {
    handleInformation : handleInformation
}
