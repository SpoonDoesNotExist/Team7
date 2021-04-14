let id_counter = 0;
let doSleep = true;

let colorMap = new Map();
colorMap.set('common', '#aa6666');
colorMap.set('active', '#e2a137c2');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function isString(s) {
    return isNaN(parseFloat(s));
}


function isNumber(s) {
    return !isNaN(parseFloat(s));
}



function inArray(value, array) {
    for (let elem of array) {
        if (elem == value)
            return true;
    }
    return false;
}


function OK(currValue, okValue) {
    if (isNumber(okValue)) {
        return currValue < okValue;
    } else {
        return inArray(currValue, okValue);
    }
}


function getCategories(dataset, index) {
    let categoriesSet = new Set();
    for (let row of dataset) {
        categoriesSet.add(row[index]);
    }
    return [...categoriesSet];
}


function getCompositions(categories) {

    if (categories.length == 1) {
        return categories;
    }

    let allSubsets = [];
    let subset = new Array(categories.length);

    let binArray = [0, 1];

    function subsetGenerator(i, depth) {
        for (let n of binArray) {
            if (depth == 1 && n == 1)
                continue;

            subset[i] = n;

            if (i == categories.length - 1) {
                allSubsets.push([...subset]);
            } else {
                subsetGenerator(i + 1, depth + 1);
            }
        }
    }

    subsetGenerator(0, 1);
    allSubsets = allSubsets.slice(1);

    let allCompositions = [];
    for (let subset of allSubsets) {
        let composition = [];
        for (let i in subset) {
            if (subset[i] == 1) {
                composition.push(categories[i]);
            }
        }
        allCompositions.push(composition);
    }

    return allCompositions;
}


class DecicionTree {
    constructor(max_depth = 3, min_size = 10, n_fold = 1) {
        this.root = null;
        this.treeDiagram = null;
        this.max_depth = max_depth;
        this.min_size = min_size;
        this.n_fold = 1;
    }


    to_terminal(group) {
        let outcomesMap = new Map();
        for (let row of group) {
            if (outcomesMap.has(row[row.length - 1])) {
                outcomesMap.set(row[row.length - 1], outcomesMap.get(row[row.length - 1]) + 1);
            } else {
                outcomesMap.set(row[row.length - 1], 1);
            }
        }

        let the_most_frequent_key;
        let frequency = 0;
        for (let kv of outcomesMap) {
            if (kv[1] > frequency) {
                the_most_frequent_key = kv[0];
                frequency = kv[1];
            }
        }

        return { value: the_most_frequent_key, id: `node-${++id_counter}`, isTerminal: true };
    }


    test_split(index, value, dataset) {
        let left = [];
        let right = [];

        for (let row of dataset) {
            if (OK(row[index], value))
                left.push(row)
            else
                right.push(row)
        }
        return [left, right];
    }


    gini_index(groups, classes) {

        let n_instances = 0;
        for (let group of groups) {
            n_instances += group.length;
        }

        let gini = 0.0
        for (let group of groups) {
            let size = group.length;

            if (size == 0)
                continue;
            let score = 0.0

            for (let class_val of classes) {
                let p = 0;
                for (let row of group) {
                    if (row[row.length - 1] == class_val)
                        p++;
                }
                p /= size;
                score += p * p;
            }


            gini += (1.0 - score) * (size / n_instances)
        }
        return gini;
    }


    get_split(dataset) {

        let class_set = new Set();
        for (let row of dataset) {
            class_set.add(row[row.length - 1]);
        }
        let class_values = [...class_set];

        let b_index = Infinity;
        let b_value = Infinity;
        let b_score = Infinity;
        let b_groups = [
            [],
            []
        ];

        for (let index = 0; index < dataset[0].length - 1; index++) {

            if (isString(dataset[0][index])) {
                let categories = getCategories(dataset, index);
                let categoryCompositions = getCompositions(categories);

                for (let c of categoryCompositions) {

                    let groups = this.test_split(index, c, dataset);
                    let gini = this.gini_index(groups, class_values);

                    if (gini < b_score) {
                        b_index = index;
                        b_value = c;
                        b_score = gini;
                        b_groups = groups;
                    }
                }
            } else {
                for (let row of dataset) {
                    let groups = this.test_split(index, row[index], dataset)
                    let gini = this.gini_index(groups, class_values)

                    if (gini < b_score) {
                        b_index = index;
                        b_value = row[index];
                        b_score = gini;
                        b_groups = groups;
                    }
                }
            }

        }
        return { 'index': b_index, 'value': b_value, 'groups': b_groups, id: `node-${++id_counter}`, isTerminal: false };
    }


    split(node, depth) {
        let left = node['groups'][0];
        let right = node['groups'][1];

        delete node['groups'];

        if (left.length == 0 || right.length == 0) {
            left.push(...right);
            node['left'] = this.to_terminal(left);
            node['right'] = this.to_terminal(left);
            return
        }

        if (depth >= this.max_depth) {
            node['left'] = this.to_terminal(left);
            node['right'] = this.to_terminal(right);
            return
        }

        if (left.length <= this.min_size) {
            node['left'] = this.to_terminal(left);
        } else {
            node['left'] = this.get_split(left);
            this.split(node['left'], depth + 1);
        }

        if (right.length <= this.min_size) {
            node['right'] = this.to_terminal(right);
        } else {
            node['right'] = this.get_split(right);
            console.log(node['right'].groups);
            this.split(node['right'], depth + 1);
        }
    }



    optimizable(node) {
        return !node.isTerminal && node['left'].isTerminal && node['right'].isTerminal && node['left'].value == node['right'].value;
    }

    optimizeDepth(node) {
        if (node.isTerminal) {
            return node;
        }

        if (this.optimizable(node)) {
            return { value: node['left'].value, id: node['id'], isTerminal: true };
        } else {
            node['left'] = this.optimizeDepth(node['left']);
            node['right'] = this.optimizeDepth(node['right']);
        }

        if (this.optimizable(node)) {
            return {
                value: node['left'].value,
                id: node['id'],
                isTerminal: true,
            };
        }

        return node;
    }


    build_tree(train, max_depth = 3, min_size = 10) {
        this.max_depth = max_depth;
        this.min_size = min_size;

        this.root = this.get_split(train);
        this.split(this.root, 1);

        this.root = this.optimizeDepth(this.root);

        console.log('PAM')
    }


    async predict(node, row) {

        console.log(node['id']);

        let tree_node;
        if (doSleep) {
            tree_node = document.getElementById(node['id']);
            await sleep(150);
            tree_node.style.backgroundColor = colorMap.get('active');
            await sleep(150);
        }
        if (Object.keys(node).length == 3) {
            if (doSleep) {
                tree_node.style.backgroundColor = colorMap.get('common');
                await sleep(50);
            }
            return node.value;
        }


        let rec;

        if (OK(row[node['index']], node['value'])) {
            if (Object.keys(node['left']).length > 3) {
                rec = await this.predict(node['left'], row)
            } else {
                rec = await this.predict(node['left']);
            }
        } else {
            if (Object.keys(node['right']).length > 3) {
                rec = await this.predict(node['right'], row)
            } else {
                rec = await this.predict(node['right']);
            }
        }

        if (doSleep) {
            tree_node.style.backgroundColor = colorMap.get('common');
            await sleep(50);
        }
        return rec;
    }


    drawDecicionTree(node, depth = 0, parent) {

        console.log(`depth: ${depth}`);

        let li = document.createElement('li');
        parent.append(li);

        let span = document.createElement('span');
        li.append(span);

        span.id = node['id'];

        if (Object.keys(node).length > 3) {
            if (features.length == 0) {
                span.innerText = `X${node['index'] + 1} < ${node['value']}   id=${node['id']}`;
            } else {
                span.innerText = `${features[node['index']]} < ${node['value']}    id=${node['id']}`;
            }

            let ul = document.createElement('ul');
            li.append(ul);

            this.drawDecicionTree(node['left'], depth + 1, ul);
            this.drawDecicionTree(node['right'], depth + 1, ul);
        } else {
            span.innerText = `${node['value']}   id=${node['id']}`;
            return;
        }
    }

}


let tree = new DecicionTree();

let dataset = [];
let features = [];
let trainDataset = [];
let testDataset = [];
let predictionDataset = [];

let max_depth = 4;
let min_size = 4;
let CV_fold = 1;


function printTree(currTree) {
    currTree.treeDiagram.innerText = '';
    currTree.drawDecicionTree(currTree.root, 0, currTree.treeDiagram);
}


//Start learning.
let learnButton = document.getElementById("learnButton");

async function testPrediction(testDataset, currTree) {
    let prediction;
    let predictionArray = [];

    for (let row of testDataset) {
        prediction = await currTree.predict(currTree.root, row);
        predictionArray.push(prediction);
    }

    return predictionArray;
}


function splitCV(data, n_fold) {
    data = clearData(data);
    data = shuffle(data);

    let step = Math.floor(data.length / n_fold);
    let folds = [];

    for (let i = 0; i < data.length; i += step) {
        folds.push(data.slice(i, Math.min(i + step, data.length)));
    }

    if (data.length % n_fold != 0) {
        let rest = folds[folds.length - 1];
        folds = folds.slice(0, folds.length - 1);

        for (let i = 0; i < rest.length; i++) {
            folds[i % rest.length].push(rest[i]);
        }
    }

    return folds;
}


function getExpectationArray(data) {
    let arr = [];
    for (row of data) {
        arr.push(row[row.length - 1]);
    }
    return arr;
}


function getAccuracy(pred, expect) {
    let matchCount = 0;
    for (let i in pred) {

        console.log(`Exp. ${expect[i]} Got${pred[i]}`);


        if (pred[i] == expect[i])
            matchCount++;
    }

    return matchCount / pred.length;
}


learnButton.onclick = async function() {
    CV_fold = CV_fold_input.value;

    doSleep = false;

    if (CV_fold == 1) {

        id_counter = 0;

        let splittedDataset = splitTrainTest(dataset);
        trainDataset = splittedDataset[0];
        testDataset = splittedDataset[1];

        let currTree = new DecicionTree();
        currTree.treeDiagram = document.getElementById('tree_diag');
        currTree.build_tree(trainDataset, max_depth, min_size, 'tree_diagram');
        printTree(currTree);

        doSleep = false;
        let predictionArray = await testPrediction(testDataset, currTree);
        doSleep = true;

        for (i in predictionArray) {
            console.log(`Expect ${testDataset[i][testDataset[i].length - 1]} Got ${predictionArray[i]}`);
        }

        tree = currTree;

    } else {

        let splittedDataset = splitCV(dataset, CV_fold);

        let accuracyArray = [];
        for (let i in splittedDataset) {

            id_counter = 0;
            let currTree = new DecicionTree();

            let validationDataset = splittedDataset[i];
            let trainDataset = [];
            for (let j in splittedDataset) {
                if (j != i)
                    trainDataset = trainDataset.concat(splittedDataset[j]);
            }

            currTree.treeDiagram = document.getElementById('tree_diag');
            currTree.build_tree(trainDataset, max_depth, min_size, 'tree_diagram');

            let predictionArray = await testPrediction(validationDataset, currTree);

            console.log(`CV array: ${predictionArray}`);

            let expectationArray = getExpectationArray(validationDataset);
            accuracyArray.push([getAccuracy(predictionArray, expectationArray), currTree]);

            let bestResult = accuracyArray.reduce(function(p, v) {
                return (p[0] > v[0] ? p : v);
            });
            console.log(`Best CV res. : `);
            console.log(bestResult);

            tree = bestResult[1];
            printTree(tree);
        }
        console.log(accuracyArray);
    }

    doSleep = true;
}


//Считывание таблицы в массив.
function readTable(results) {
    console.log(`Reading table...`);

    let data = results.data;
    let currentDataset = [];

    for (i = 0; i < data.length; i++) {
        let row = [];
        let cells = data[i].join(",").split(",")

        for (j = 0; j < cells.length; j++)
            row.push(cells[j]);

        currentDataset.push(row);
    }

    if (isNaN(parseFloat(currentDataset[0][0]))) {
        return [
            currentDataset[0], currentDataset.slice(1)
        ];
    } else {
        return [
            [], currentDataset
        ];
    }
}


let testingResults = document.getElementById('testing_results');
let predictButton = document.getElementById('predictButton');
let fileInputPrediction = document.getElementById('fileInput_prediction');

function readPredictionTable(results) {
    let trash;
    [trash, predictionDataset] = readTable(results);

    predictionDataset = clearData(predictionDataset);
    predictionDataset = shuffle(predictionDataset);

    console.log(`ReadPred processed`)
}


predictButton.onclick = async function() {
    await new Promise((resolve, reject) => {
        Papa.parse(fileInputPrediction.files[0], {
            complete: function(results) {
                readPredictionTable(results);
                resolve('parsed');
            }
        });
    })


    let predictions = [];
    testingResults.innerText = '';
    //doSleep = false;

    for (let row of predictionDataset) {
        console.log("-".repeat(15));

        let got = await tree.predict(tree.root, row);

        predictions.push(got);

        let li = document.createElement('li');
        li.className = 'result_li';
        li.innerText = `Sample: ${row}\nClass: ${got}`;
        testingResults.append(li);
    }

    let acc = 0;
    for (let i in predictionDataset) {
        if (predictionDataset[i][predictionDataset[i].length - 1] == predictions[i])
            acc++;
    }
    acc /= predictions.length;

    testingResults.append(acc);

    doSleep = true;
}


//Перемешиваем образцы.
function shuffle(arr) {
    var j, temp;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}


//Удаляем поврежденные образцы из данных.
function clearData(data) {
    let cleared = [];
    let invalidSamples = 0;
    for (let row of data) {
        if (row.length == data[0].length) {
            cleared.push(row);
        } else {
            invalidSamples++;
        }
    }

    console.log(`Invalid samples ${invalidSamples}`);

    return cleared;
}


//Разбиение данных на тренировочную и тестовую части. 
function splitTrainTest(data, proportion = 0.7) {
    data = clearData(data);
    data = shuffle(data);

    let trainDataset = data.slice(0, Math.floor(proportion * data.length));
    let testDataset = data.slice(Math.floor(proportion * data.length), data.length);

    return [trainDataset, testDataset];
}


let tableDiv = document.getElementById("tableDiv");

//Отрисовка таблицы.
function drawTable(table, results) {
    console.log(`Drawing table...`);

    table.innerHTML = '';

    let data = results.data;

    let rowElem;
    let colElement;

    for (i = 0; i < data.length; i++) {
        rowElem = document.createElement('tr');
        let row = data[i];
        let cells = row.join(",").split(",");

        for (j = 0; j < cells.length; j++) {
            colElement = document.createElement('td');
            colElement.className = 'sampleFeature';
            colElement.innerText = cells[j];

            rowElem.append(colElement);
        }
        table.append(rowElem);
    }
    tableDiv.append(table);

    console.log(`Drawing is complete`);
}


//Создание таблицы.
function getArrayFromTable(results) {
    [features, dataset] = readTable(results);
}


//Ввод тренеровочного csv файла.
let submitFileInput = document.getElementById("submitFileInput");
let fileInput = document.getElementById("fileInput");
let CV_fold_input = document.getElementById('CV_fold');

submitFileInput.onclick = async function() {
    console.log(`PapaParse start.`);

    await Papa.parse(fileInput.files[0], {
        complete: getArrayFromTable,
    });

    console.log(`PapaParse over.`);
}


//Ввод гиперпараметров.
let max_depth_input = document.getElementById("max_depth");
let min_size_input = document.getElementById("min_size");
let hyperparameters_button = document.getElementById("hyperparameters_button");
hyperparameters_button.onclick = function() {

    testingResults.innerText = '';

    max_depth = max_depth_input.value;
    min_size = min_size_input.value;
}