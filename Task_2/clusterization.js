let canvas = document.getElementById("samples_field"),
    context = canvas.getContext('2d');
canvas.onclick = draw;

let K_input = document.getElementById('clusters_count');
let circleSize = 30;
//---------------------------------------------------------------------------------------------------------


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateHslaColors(saturation, lightness, alpha, amount) {
    let colors = [];
    let shift = getRandomInt(0, 360);
    let huedelta = Math.trunc(360 / amount);

    for (let i = 0; i < amount; i++) {
        let hue = (i * huedelta + shift) % 360;
        colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`)
    }

    return colors
}


function generate_N_colors(n) {
    let colorMap = new Map();
    let colors = generateHslaColors(70, 50, 1, n);

    for (let i = 0; i < colors.length; i++) {
        colorMap.set(i, colors[i]);
    }

    return colorMap;
}
/*
colorMap.set(0, '#c90a0a');
colorMap.set(1, '#28b915');
colorMap.set(2, '#3714d3');
*/



//---------------------------------------------------------------------------------------------------------

class Point {
    constructor(coordinates, index) {
        this.coordinate = coordinates;
        this.dimensionality = coordinates.length;
        this.index = index
    }


    static calculateEuclideanMetric(p1, p2) {
        if (p1.dimensionality != p2.dimensionality) {
            alert(`Can't find Euclidean metric. Different dimentionality: ${p1.dimensionality} and ${p2.dimensionality}`);
            return;
        }

        let distance = 0;
        for (let i = 0; i < p1.dimensionality; i++) {
            distance += Math.pow(p1.coordinate[i] - p2.coordinate[i], 2);
        }
        distance = Math.sqrt(distance);

        return distance;
    }

    static calculateManhattanMetric(p1, p2) {
        if (p1.dimensionality != p2.dimensionality) {
            alert(`Can't find Manhattan metric. Different dimentionality: ${p1.dimensionality} and ${p2.dimensionality}`);
            return;
        }

        let distance = 0;
        for (let i = 0; i < p1.dimensionality; i++) {
            distance += Math.abs(p1.coordinate[i] - p2.coordinate[i]);
        }
        distance /= p1.dimensionality;

        return distance;
    }


    static calculateChebyshevMetric(p1, p2) {
        if (p1.dimensionality != p2.dimensionality) {
            alert(`Can't find Chebyshev metric. Different dimentionality: ${p1.dimensionality} and ${p2.dimensionality}`);
            return;
        }

        let distance = 0;
        for (let i = 0; i < p1.dimensionality; i++) {
            distance = Math.max(p1.coordinate[i] - p2.coordinate[i], distance);
        }

        return distance;
    }


    static calculateMetric(p1, p2, metric = 'euclidean') {
        return metricsMap.get(metric)(p1, p2);
    }
}

class Cluster {
    constructor(dimensionality, index) {
        this.elements = new Map();
        this.center = new Point(new Array(dimensionality), -1);
        this.index = index
    }


    static createClustersArray(size, dimensionality) {
        let clusters = new Array(size);
        for (let i = 0; i < size; i++) {
            clusters[i] = new Cluster(dimensionality, i);
        }
        return clusters;
    }
}

class Field {
    getCenterOfMass(points) {
        console.log(`Center of mass for points:`)
        console.log(points);

        let coordinates = new Array(this.dimensionality);
        for (let i = 0; i < this.dimensionality; i++) {
            let sum = 0;
            for (let p of points) {
                sum += p.coordinate[i];
            }
            coordinates[i] = sum / points.length;
        }

        console.log(`Center of mass = ${coordinates}`)
        console.log('\n\n\n');

        return new Point(coordinates);
    }


    randomPointDistribution() {
        for (let i = 0; i < this.K; i++) {
            this.clusters[i].elements.set(i, this.points[i]);
            this.point_cluster_map.set(i, i);
        }

        for (let i = this.K; i < this.points.length; i++) {
            let cluster_index = this.random_distribution_indexes[i];
            this.clusters[cluster_index].elements.set(this.points[i].index, this.points[i]);
            this.point_cluster_map.set(i, cluster_index);
            console.log(`RANDOM CI: ${cluster_index}`);
        }
        for (let c of this.clusters) {
            c.center = this.getCenterOfMass(Array.from(c.elements.values()));
        }
    }


    constructor(points, K = 3, eps = 0.1, metric = 'euclidean', random_distribution_indexes = null) {
        this.points = points;
        this.K = K;
        this.eps = eps;
        this.dimensionality = this.points[0].dimensionality;
        this.metric = metric;
        this.colorMap = generate_N_colors(this.K);

        if (random_distribution_indexes) {
            this.random_distribution_indexes = random_distribution_indexes;
        } else {
            this.random_distribution_indexes = [];
            for (let i = 0; i < this.points.length; i++) {
                this.random_distribution_indexes.push(getRandomInt(0, this.K - 1));
            }
        }

        this.point_cluster_map = new Map();
        this.clusters = Cluster.createClustersArray(this.K, this.dimensionality);
        this.randomPointDistribution();
    }


    ChooseCluster(point) {
        let cluster_index = this.point_cluster_map.get(point.index);
        console.log(`Cluster for point ${point.index} was ${cluster_index}`);
        this.clusters[cluster_index].elements.delete(point.index);

        let best_distance = Infinity;
        let best_cluster_index = -1;
        for (let c of this.clusters) {
            let cluster_center = c.center;
            let distance = Point.calculateMetric(cluster_center, point, this.metric);

            if (distance < best_distance) {
                best_distance = distance;
                best_cluster_index = c.index;
            }
        }
        this.clusters[best_cluster_index].elements.set(point.index, point);
        this.point_cluster_map.set(point.index, best_cluster_index);
        console.log(`Cluster for point ${point.index} become ${best_cluster_index}\n`);
    }


    DistributePoints() {
        for (let p of this.points) {
            this.ChooseCluster(p);
        }
        for (let c of this.clusters) {
            c.center = this.getCenterOfMass(Array.from(c.elements.values()))
        }
    }


    MSE(cluster) {
        let center = cluster.center;
        let error = 0;
        for (let point of cluster.elements.values()) {
            for (let i = 0; i < point.dimensionality; i++) {
                error += Math.pow(point.coordinate[i] - center.coordinate[i], 2);
            }
        }
        return error;
    }


    clusterizationError() {
        let error = 0;
        for (let c of this.clusters) {
            error += this.MSE(c);
        }
        return error;
    }


    async Clusterize() {
        let CE = this.clusterizationError();
        let CE_delta = Infinity;

        this.DrawClusters();
        await sleep(150);

        while (CE_delta > this.eps) {
            await sleep(150);
            this.DistributePoints();

            CE_delta = this.clusterizationError() - CE;
            CE = CE_delta + CE;
            CE_delta = Math.abs(CE_delta);
            console.log(`\n\nCE = ${CE}\n\n\n`);

            this.DrawClusters();
        }

        console.log(`\n\n\n`);
        console.log(`Clusterized field:`);
        console.log(this);

        return CE;
    }


    DrawClusters(clear = true, style = 2) {
        if (clear)
            context.clearRect(0, 0, canvas.width, canvas.height);

        let iter = 0;
        for (let c of this.clusters) {

            let x = c.center.coordinate[0];
            let y = c.center.coordinate[1];
            for (let point of c.elements.values()) {
                let posx = point.coordinate[0];
                let posy = point.coordinate[1];

                drawingStyleMap.get(style)(posx, posy, x, y, this.colorMap.get(iter));
            }
            iter++;
        }
    }
}





let currentMetric = 'euclidean';
let clasterization_K = 5;
let eps = 0.01;

let metricsMap = new Map();
metricsMap.set('euclidean', Point.calculateEuclideanMetric);
metricsMap.set('manhattan', Point.calculateManhattanMetric);
metricsMap.set('chebyshev', Point.calculateChebyshevMetric);


function drawingStyle0(x, y, centerx, centery, color) {
    let rectSize = 45;

    context.fillStyle = color;
    context.beginPath();
    context.fillRect(x - rectSize / 2, y - rectSize / 2, rectSize, rectSize);
    //context.fill();
}

function drawingStyle1(x, y, centerx, centery, color) {
    let circleSize = 20;

    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, circleSize, 0, 2 * Math.PI);
    context.fill();
}

function drawingStyle2(x, y, centerx, centery, color) {
    let circleSize = 10;

    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, circleSize, 0, 2 * Math.PI);
    context.fill();

    context.moveTo(x, y);
    context.lineTo(centerx, centery);
    context.strokeStyle = color;
    context.stroke();
}

let drawingStyleMap = new Map();
drawingStyleMap.set(0, drawingStyle0);
drawingStyleMap.set(1, drawingStyle1);
drawingStyleMap.set(2, drawingStyle2);

let points = [];




//-----------------------------------------------------------------------------------
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


function draw(e) {

    console.log(`drawing...`)

    var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;
    context.fillStyle = '#000000';
    context.beginPath();
    context.arc(posx, posy, 20, 0, 2 * Math.PI);
    //context.fillRect(posx - 10, posy - 10, 20, 20);
    context.fill();

    points.push(new Point([posx, posy], points.length));
}


let startClusterizationButton = document.getElementById('start_clusterization');
startClusterizationButton.onclick = async function() {

    clasterization_K = parseFloat(K_input.value);

    let best_fields_array = [];
    let metricsArray = ['euclidean'] //, 'manhattan', 'chebyshev'];

    let random_distribution_indexes = [];
    for (let i = 0; i < points.length; i++) {
        random_distribution_indexes.push(generate_N_colors(clasterization_K));
    }

    for (let metric of metricsArray) {
        generate_N_colors(clasterization_K);
        let itr = 0;
        let loops = Math.floor(clasterization_K);

        let best_CE = Infinity;
        let best_field = null;
        while (loops) {
            console.log(`Loop ${loops--}. \n\n\n^`);

            let field = new Field(points, clasterization_K, eps, metric);
            let CE = await field.Clusterize();

            if (CE < best_CE) {
                best_CE = CE;
                best_field = field;
            }
        }

        best_field.DrawClusters();
        best_fields_array.push(best_field);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    let iter = 0;
    for (let f of best_fields_array) {
        f.DrawClusters(false, iter++);
    }

    console.log('THE END');
}