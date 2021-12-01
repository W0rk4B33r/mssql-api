//npm install --save express
//npm i soap
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

//for soap request
const soap = require('soap');

const app = express();
const port = 3002;
app.use(bodyParser.json());
app.use(cors());


var sTables = [];

var oRow = {};
var result = "";

var dbConfig = {
	server: "CPU0186",//process.env.SERVER,
	port: 1433,
	user: "sa",//process.env.MSSQL_USER,
	password:"alliance123", //process.env.MSSQL_PASS,
	database: "ADDESSA",//process.env.MSSQL_DB,
	connectionTimeout: 150000,
	driver: 'tedious',
	stream: false,
	options: {
		encrypt: false
	},
	pool: {
		max: 20,
		min: 0,
		idleTimeoutMillis: 60000
	}
}

// app.post('/PostData', (request, response) => {
    
//     response.type('application/json');
  
//     var dbName = request.query.dbname;
//     if (!dbName){ 
//         throw("Parameter dbName is required.");
// 	}
// 	var aOperations = composeInsertStatement(request);
	
// 	var resQuery = "";
// 	sql.connect(dbConfig).then(() => {
// 		var q = aOperations.join(';');

// 		q = 'SET XACT_ABORT ON BEGIN TRAN ' + q + '; COMMIT TRAN';
// 		console.log(q);
// 		return sql.query(q);
// 		// sInsertStatements.forEach(element => {
// 		// 	return sql.query(element);
// 		// });
// 	}).then(result => {
// 		console.log( "RESULT-----------" );
// 		resQuery = result;
		

// 	}).catch(err => {
// 		console.log( "ERROR------------" + err); 
// 		resQuery = err;

// 	}).finally(() => {
// 		console.log("finally");
// 		response.send(resQuery);
// 	});
		
// 	sql.on('error', err => {
// 		console.log("outer " + err);
// 	});

// });

app.get('/ExecQuery', (request, response) => {
	
	var spname = request.query.spname;
	var queryTag = request.query.querytag;
	var val1 = request.query.value1;
	var val2 = request.query.value2;
	var val3 = request.query.value3;
	var val4 = request.query.value4;
	sql.on('error', err => {
		console.log('sql on ' + err);
	})
	
	sql.connect(dbConfig).then(pool => {
		// Stored procedure
		
		return pool.request() 
			.input('queryTag', sql.NVarChar(50), queryTag)
			.input('value1', sql.NVarChar(50), val1)
			.input('value2', sql.NVarChar(50), val2)
			.input('value3', sql.NVarChar(50), val3)
			.input('value4', sql.NVarChar(50), val4)
			.execute(spname);
	}).then(result => {
		response.send(result.recordset);
	}).catch(err => {
		response.send( '. ' + err);
		
	});



});

// function getTableCount(request){
// 	return Object.keys(request.body).length;
// }

// function getAllTableInserts(request){
// 	return Object.keys(request.body);
// }

// function composeInsertStatement(request){
// 	var aRequestBody = request.body;
// 	var sInsertStatements = [];
// 	var aTables = getAllTableInserts(request);
// 	var i = 0;
// 	var sPreInsert = "";
// 	for (i = 0; i < getTableCount(request); i++){
		
// 		var iTableRows = aRequestBody[Object.keys(aRequestBody)[i]].length;

// 		var sInsertTable = aTables[i];


// 		var j = 0;
// 		for (j = 0; j < iTableRows; j++){
// 			var oRow = aRequestBody[Object.keys(aRequestBody)[i]][j];

// 			var sOperation = oRow.O;
// 			sPreInsert = "";
// 			var oColumns = [];
// 			var index = 0;

// 			if(sOperation === "I"){
// 				//Insert
// 				sPreInsert = "INSERT INTO " + sInsertTable + "(";

// 				oColumns = Object.keys(oRow);

// 				for (index = 0; index < oColumns.length; ++index){
// 					if (oColumns[index] === "O"){
// 						continue;
// 					}
// 					sPreInsert = sPreInsert + ' ' + oColumns[index] + ' ,';

// 				}
// 				sPreInsert = sPreInsert + ' CreatedBy, CreatedDate ) VALUES (';

// 				var oValues = [];
// 				for (index = 0; index < oColumns.length; ++index){
// 					if (oColumns[index].match(/Date/gi) !== null){
// 						oValues.push("CAST('"+oRow[Object.keys(oRow)[index]]+ "' as DATE)");
// 					}else{
// 						oValues.push("'" + oRow[Object.keys(oRow)[index]] + "'");
// 					}
// 				}

// 				oValues.push("'manager'");
// 				oValues.push("(SELECT CURRENT_TIMESTAMP)");

// 				for(index = 0; index < oValues.length; ++index){
// 					if (oColumns[index]=== "O"){
// 						continue;
// 					}
// 					sPreInsert = sPreInsert + ' ' + oValues[index] + ',';

// 				}
// 			}else{
// 				//Update
// 				var preUpdate = "UPDATE " + sInsertTable + " " ;
// 				preUpdate = preUpdate + " SET ";
// 				oColumns = Object.keys(oRow);
// 				index = 0;

// 				for (index = 0; index < oColumns.length; ++index){
// 					if (oColumns[index]=== "O" || oColumns[index] === "Code"){
// 						continue;
// 					}
// 					if (oColumns[index].match(/Date/gi) !== null){
// 						preUpdate = preUpdate + ' ' + oColumns[index] + " = CAST('" + oRow[oColumns[index]] + "' as DATE), ";
						
// 					}else{
// 						preUpdate = preUpdate + ' ' + oColumns[index] + " = '" + oRow[oColumns[index]] + "', ";
// 					}

// 					preUpdate = preUpdate + " UpdatedBy = 'manager' , UpdatedDate = (SELECT CURRENT_TIMESTAMP) ";
// 					preUpdate = preUpdate + " WHERE Code = '" + oRow.Code+ "';";
// 					sPreInsert = preUpdate;
// 				}
// 			}
// 			if (sOperation === "I"){
// 				sPreInsert = sPreInsert.slice(0,-1) + ")";
// 			}
			
// 			sInsertStatements.push(sPreInsert);
			
// 		}
// 	}
// 	console.log(sInsertStatements);
// 	return sInsertStatements;

// }

app.get('/', (request, response) => {
    response.send("API Endpoints: \n   /PostData?dbname=DBNAME\n   /ExecQuery?dbname=DBNAME&param1=val");
});


//---------------------------------------------------------
app.listen(port, () => {
    console.log("API is running on port " + port);
})
