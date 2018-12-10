const handleDisplay = (connection) => (req, res) => {
    const get = req.query;
    console.log("word", get['word']);
    const query = 'SELECT * FROM inspection_record LIMIT 5';
    connection.query(query, (err, rows, fields) => {
        if(err){
            console.log("An error ocurred performing the query.");
            res.json("error")
        }
        else{
            console.log("Query succesfully executed");
            res.json(rows);
        }
    });
}

module.exports = {
    handleDisplay: handleDisplay
}
