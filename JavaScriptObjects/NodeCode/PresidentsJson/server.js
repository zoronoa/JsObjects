var express = require('express');
var simpledb = require('simpledb');
var app = express();
var fs = require('fs');
var coreData = { Domain: 'History', Category: 'Presidents02' };

var port = process.env.port || 30025;
app.use(express.bodyParser());
var presidentsFileName = 'data/Presidents.json';

app.get('/', function(req, res) {
	var html = fs.readFileSync('public/index.html');
	res.writeHeader(200, {
		"Content-Type" : "text/html"
	});
	res.write(html);
	res.end();
});

app.get('/testAzureSimpleDb', function(req, res) {
	var html = fs.readFileSync('public/testAzureSimpleDb.html');
	res.writeHeader(200, {
		"Content-Type" : "text/html"
	});
	res.write(html);
	res.end();
});

app.get('/listDomains', function(req, res) {
	// console.log('request called');
	sdb.listDomains(function(error, result, meta) {
		if (error) {
			res.send('listDomains failed: ' + error.Message);
		} else {
			res.send(result);
		}
	});
});

app.get('/listItems', function(request, result) {
	sdb.select('select ItemName from History', function(error, queryResult,
			metadata) {
		if (error) {
			res.send('history query failed: ' + error.Message);
		} else {
			result.send(queryResult);
		}
	});
});

app.get('/getPresidents', function(request, response) {
	var json = fs.readFileSync(presidentsFileName);
	response.send(json);
});

app.get('/deleteDomain', function(request, result) {
	sdb.deleteDomain(coreData.Domain, function(error, queryResult, metadata) {
		if (error) {
			res.send('history query failed: ' + error.Message);
		} else {
			result.send(queryResult);
		}
	});	
});

app.get('/createDomain', function(request, result) {
	createDomain(coreData.Domain, result);
});

function createDomain(domainName, result)
{
	sdb.createDomain(domainName, function(error, queryResult, metadata) {
		if (error) {
			result.send('DomainFCreationFailed: ' + error.Message);
		} else {
			result.send( { success: 'Success' } );
		}
	});	
}

app.get('/addListOfPresidents', function(request, result) {
	createDomain(coreData.Domain, result);
	var items = [{
		$ItemName: utils.getUuid(), 
		Category : coreData.Category,
		FirstName : 'George',
		MiddleName : '',
		LastName : 'Washington',
		Sequence : '01'
	},{
		$ItemName: utils.getUuid(), 
		Category : coreData.Category,
		FirstName : 'John',
		MiddleName : '',
		LastName : 'Adams',
		Sequence : '02'
	},{
		$ItemName: utils.getUuid(), 
		Category : coreData.Category,
		FirstName : 'Thomas',
		MiddleName : '',
		LastName : 'Jefferson',
		Sequence : '03'
	},{
		$ItemName: utils.getUuid(), 
		Category : coreData.Category,
		FirstName : 'James',
		MiddleName : '',
		LastName : 'Madison',
		Sequence : '04'
	},{
		$ItemName: utils.getUuid(), 
		Category : coreData.Category,
		FirstName : 'James',
		MiddleName : '',
		LastName : 'Monroe',
		Sequence : '05'
	},{
		$ItemName: utils.getUuid(), 
		Category : coreData.Category,
		FirstName : 'John',
		MiddleName : 'Quincy',
		LastName : 'Adams',
		Sequence : '06'
	}];
	
	sdb.batchPutItem(coreData.Domain, items, function(error, putItemResult, meta) {
		if (error) {
			console.log(error);
			return { result : "Error" };
		} else {			
			return { result : "Success"	};
		}
	});
	
	/* putItem('Andrew', 'Jackson');
	putItem('Martin Van', 'Buren');
	putItem('William Henry', 'Harrison');
	putItem('John', 'Tyler');
	putItem('James K.', 'Polk');
	putItem('Zachary', 'Taylor');
	putItem('Millard', 'Fillmore');
	putItem('Franklin', 'Pierce');
	putItem('James', 'Buchanan');
	putItem('Abraham', 'Lincoln');
	putItem('Andrew', 'Johnson');
	putItem('Ulysses S.', 'Grant');
	putItem('Rutherford B.', 'Hayes');
	putItem('James', 'Garfield');
	putItem('Chester A.', 'Arthur');
	putItem('Grover', 'Cleveland');
	putItem('Benjamin', 'Harrison');
	putItem('William', 'McKinley');
	putItem('Theodore','Roosevelt');	
	putItem('William Howard', 'Taft');
	putItem('Woodrow', 'Wilson');
	putItem('Warren G.', 'Harding');
	putItem('Calvin', 'Coolidge');
	putItem('Herbert', 'Hoover');
	putItem('Franklin D.', 'Roosevelt');
	putItem('Harry S.', 'Truman');
	putItem('Dwight D.', 'Eisenhower');
	putItem('John F', 'Kennedy');
	putItem('Lyndon B.','Johnson');
	putItem('Richard','Nixon');
	putItem('Gerald','Ford');
	putItem('Jimmy','Carter');
	putItem('Ronald','Reagan');
	putItem('George', 'Bush');
	putItem('Bill','Clinton');
	putItem('George W.', 'Bush');
	putItem('Barack','Obama'); */

});

function writeToFile(fileName, json) {
	fs.writeFile(fileName, json, function(err) {
		if(err) {
		  console.log(err);
		} else {
		  console.log("JSON saved to " + fileName);
		  return {"result":"success"};
		}
	});	
}

app.post('/savePresidents', function(request, result) {
	console.log("savePresidents called");
	
	if (typeof request.body == 'undefined') {
		console.log("request.body is not defined. Did you add app.use(express.bodyParser()); at top");
	} else {
	console.log(request.body);	
	var details = request.body.details;
	var json = JSON.parse(request.body.data);
	console.log(details);
	json = JSON.stringify(json, null, 4);
	writeToFile(presidentsFileName, json);
	}
});

app.get('/putitem', function(request, result) {	
	console.log(request.query.presidentName);
	console.log(request.query.born);
	console.log(request.query.died);
	writeToFile('temp.json', request.query)
	result.send(outcome);
});

app.get('/update', function(request, result) {
	console.log('Update Called');
	var uuid = request.query.uuid;	
	var firstName = request.query.firstName;
	var middleName = request.query.middleName;
	middleName = (middleName.trim().length === 0) ? '-' : middleName;
	lastName = request.query.lastName;
	console.log(uuid);
	console.log(firstName);
	console.log(middleName);
	console.log(lastName);
	result.send(updateOrInsert(coreData.Domain, uuid, coreData.Category, firstName, middleName, lastName));
});

function putItem(firstName, middleName, lastName) {
	uuid = utils.getUuid();
	console.log(uuid);
	return updateOrInsert(coreData.Domain, uuid, coreData.Category, firstName, middleName, lastName);
}

function updateOrInsert(domain, uuid, category, firstName, middleName, lastName) {
	sdb.putItem(coreData.Domain, uuid, {
		Category : category,
		FirstName : firstName,
		MiddleName: middleName,
		LastName : lastName
	}, function(error, putItemResult, meta) {
		if (error) {
			console.log(error);
			return { result : "Error" };
		} else {			
			return { result : "Success"	};
		}
	});
}

app.get('/getitem', function(request, result) {
	console.log(request.query.itemName);
	sdb.getItem('History', request.query.itemName, function(error,
			getItemResult) {
		if (error) {
			console.log(error);
		} else {
			console.log(getItemResult);
			result.send(getItemResult);
		}
	});
});

app.get('/delete', function(request, result) {
	console.log(request.query.itemName);
	result.send(deleteItem(request.query.itemName));
});

function deleteItem(item) {
	sdb.deleteItem(coreData.Domain, item, function(error,	getItemResult, meta) {
		if (error) {
			console.log(error);
		} else {
			console.log(getItemResult);
			return getItemResult;
		}
	});
}

app.get('/deleteAll', function(request, result) {	
	getItemsToDelete(result);	
});

function getItemsToDelete(result) {
	sdb.select('select ItemName from History where Category="' + coreData.Category + '"', 
			function(error, queryResult, metadata) {
				if (error) {
					result.send({ failure : error.Message });
				} else {
					var itemsToDelete = [];
					var numItems = queryResult.length;
					// We are only allowed to delete 25 items at a time.
					if (numItems > 25) numItems = 24;
					for (var i = 0; i < numItems; i++)
					{						
						itemName = queryResult[i]['$ItemName'];
						//console.log(itemName);
						var deleteItem = { $ItemName : itemName };
						itemsToDelete.push(deleteItem);
					}
					batchDelete(itemsToDelete, result);					
				}
			});
}

function batchDelete(itemsToDelete, result) {
	//console.log("About to delete these items: ");
	// console.log(itemsToDelete);
	sdb.batchDeleteItem(coreData.Domain, itemsToDelete, function(error, queryResult, metaData) {
		if (error) {
			console.log(error.Message);
			result.send(error.Message);
		} else {
			//console.log( { result: 'Success' } );
			result.send({ result: 'Success' });
		}
	});
}

app.get('/domainmeta', function(request, result) {
	sdb.domainMetadata(coreData.Domain, function(error, queryResult, metadata) {
		if (error) {
			console.log(error);
			// res.send('listDomains failed: '+ error.Message );
		} else {
			console.log(queryResult);
			result.send(queryResult);
		}
	});
});

app.get('/dirname', function(req, result) {
	result.send({
		'result' : __dirname
	});
});

app.get('/port', function(request, result) {
	result.send({
		'result' : port
	});
});

app.use(express.static(__dirname + '/public'));

console.log("listening on Port: ", port);
app.listen(port);