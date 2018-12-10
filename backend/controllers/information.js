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
    const queryRecommendationId = `
                    SELECT yr.business_id
                    FROM yelp_review yr
                    WHERE yr.user_id IN ( 
                                SELECT yr2.user_id
                                FROM yelp_review AS yr2
                                WHERE yr2.business_id = "${business_id}"
                                ) 
                        AND yr.business_id <> "${business_id}"
                    GROUP BY yr.business_id
                    HAVING COUNT(*) > 5
                    ORDER BY AVG(yr.stars) DESC
                    LIMIT 3;
                    `
    const queryRecommendationName = `
                    SELECT restaurant_name
                    FROM restaurant
                    WHERE business_id = "###";
                    `
    const queryRecommendationPhoto = `
                    SELECT photo_id
                    FROM yelp_photo
                    WHERE businedd_id = "###"
                    LIMIT 1;
                    `

                    
    // const queryRecommendationName = `
    //                 SELECT r.restaurant_name
    //                 FROM yelp_review_temp yr JOIN restaurant r
    //                 WHERE yr.business_id = "${business_id}"
    //                         AND user_id IN ( 
    //                             SELECT yr2.user_id
    //                             FROM yelp_review AS yr2
    //                             WHERE yr2.business_id = r.business_id
    //                         )
    //                 GROUP BY yr.business_id
    //                 HAVING COUNT(yr.stars) > 10
    //                 ORDER BY AVG(yr.stars) DESC
    //                 LIMIT 3;
    //                 ` 
    // const queryRecommendationPhoto = `
    //                 SELECT p.photo_id
    //                 FROM yelp_review_temp yr JOIN yelp_photo p
    //                 WHERE yr.business_id = "${business_id}"
    //                         AND user_id IN ( 
    //                             SELECT yr2.user_id
    //                             FROM yelp_review AS yr2
    //                             WHERE yr2.business_id = r.business_id
    //                         )
    //                 GROUP BY yr.business_id
    //                 HAVING COUNT(yr.stars) > 10
    //                 ORDER BY AVG(yr.stars) DESC
    //                 LIMIT 3;
    //                 ` 
    // console.log(query);
    
    const query = queryGeneralInfo + queryReviews + queryViolations + queryPhoto + queryInspection + queryCategory + queryRecommendationId;
    connection.query(query, [1, 2, 3, 4, 5, 6, 7], (err, rows, fields) => {
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
                recommendation: []
            }
            
            // let i = 0;
            // let business_id = rows[6][i].business_id;
            // qrName = queryRecommendationName.replace("###",business_id);
            // qrPhoto = queryRecommendationPhoto.replace("###",business_id);
            // for(let i = 0; i < rows[6].length; i++){
            //     connection.query(qrName + qrPhoto, [1, 2], (err2, rows2, fields2) => {
            //         if(err){
            //             console.log("An error ocurred performing the query.");
            //             res.json("error");
            //         } 
            //         else{
            //             results.recommendation.push(business_id);
            //         }
            //     });
            // }
            
            res.json(results);
        }
    });
}



module.exports = {
    handleInformation : handleInformation
}
