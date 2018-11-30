const handleDisplay = (connection) => (req, res) => {
    $query = 'SELECT * FROM test';
    connection.query($query, (err, rows, fields) => {
        if(err){
            console.log("An error ocurred performing the query.");
            return;
        }
        console.log("Query succesfully executed: ", rows);
    });
}

module.exports = {
    handleDisplay: handleDisplay
}
