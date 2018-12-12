const handleRecommendation = (connection) => (req, res) => {
    const { name, business_id } = req.body;
    const queryRecommendationName = `
                    SELECT r.restaurant_name, r.business_id
                    FROM yelp_review_temp yr 
                    JOIN restaurant r on r.business_id = yr.business_id
                    WHERE yr.user_id IN ( 
                    SELECT yr2.user_id
                    FROM yelp_review AS yr2
                    WHERE yr2.business_id = "${business_id}"
                    ) AND yr.business_id <> "${business_id}"
                    GROUP BY yr.business_id
                    HAVING COUNT(*) > 5
                    ORDER BY AVG(yr.stars) DESC
                    LIMIT 3;
                    `
    const queryRecommendationPhoto = `
                    SELECT p.photo_id, p.business_id
                    FROM yelp_photo p JOIN
                    (SELECT yr.business_id
                    FROM yelp_review_temp yr
                    WHERE yr.user_id IN ( 
                    SELECT yr2.user_id
                    FROM yelp_review AS yr2
                    WHERE yr2.business_id = "${business_id}"
                    ) AND yr.business_id <> "${business_id}"
                    GROUP BY yr.business_id
                    HAVING COUNT(*) > 5
                    ORDER BY AVG(yr.stars) DESC
                    LIMIT 3) temp ON temp.business_id = p.business_id
                    GROUP BY p.business_id
                    LIMIT 3;
                    `

    const query = queryRecommendationName + queryRecommendationPhoto;
    connection.query(query, [1, 2], (err, rows, fields) => {
        if(err){
            console.log("An error ocurred performing the query.");
            res.json("error");
        }
        else {
            const results = {
                recommendationName: rows[0],
                recommendationPhoto: rows[1],
            }
            res.json(results);
        }
    });
}



module.exports = {
    handleRecommendation : handleRecommendation
}
