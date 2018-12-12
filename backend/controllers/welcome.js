const handleWelcome = (connection) => (req, res) => {

    let { name, address } = req.body.query;
    const query = ` SELECT * FROM restaurant r 
                    JOIN yelp_business y ON r.business_id = y.business_id 
                    JOIN inspection_record i ON r.restaurant_name = i.restaurant_name
                    WHERE r.restaurant_name LIKE "%${name}%" 
                        AND r.address LIKE "%${address}%" 
                    LIMIT 500`;
    connection.query(query, (err, rows, fields) => {
        if(err){
            console.log("An error ocurred performing the query.");
            res.json("error");
        }
        else{
            console.log("Query succesfully executed");
            res.json(rows);
        }
    });
}



module.exports = {
    handleWelcome : handleWelcome
}
