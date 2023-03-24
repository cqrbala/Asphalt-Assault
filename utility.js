import * as THREE from 'three';

const trackRadius = 625;
const trackWidth = 200;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

// const arcAngle1 = (1 / 3) * Math.PI;

// const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
// const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

// const arcCenterX = (Math.cos(arcAngle1) * innerTrackRadius + Math.cos(arcAngle2) * outerTrackRadius) / 2;

// const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);

// const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

export function renderMap(mapWidth, mapHeight, scene) {

    const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);

    const planeGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
    const planeMaterial = new THREE.MeshLambertMaterial({
        map: lineMarkingsTexture
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    //const islandLeft = getLeftIsland();
    //const islandRight = getRightIsland();
    const islandMiddle = getMiddleIsland();
    const outerField = getOuterField(mapWidth, mapHeight);

    const FieldGeometry = new THREE.ExtrudeGeometry(
        [islandMiddle, outerField],
        { depth: 6, bevelEnabled: false }
    );

    const FieldMesh = new THREE.Mesh(FieldGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x48DF5B }),
        new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ]);

    scene.add(FieldMesh);
}

function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext("2d");

    context.fillStyle = "#546e90";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 2;
    context.strokeStyle = "#e0ffff";
    context.setLineDash([10, 14]);

    // left circle
    context.beginPath();
    context.arc(
        mapWidth / 2,
        mapHeight / 2,
        trackRadius,
        0,
        Math.PI * 2
    );
    context.stroke();

    // // right circle
    // context.beginPath();
    // context.arc(
    //     mapWidth / 2 + arcCenterX,
    //     mapHeight / 2,
    //     trackRadius,
    //     0,
    //     Math.PI * 2
    // );
    // context.stroke();

    return new THREE.CanvasTexture(canvas);
}

// function getLeftIsland() {
//     const islandLeft = new THREE.Shape();

//     islandLeft.absarc(
//         -arcCenterX,
//         0,
//         innerTrackRadius,
//         arcAngle1,
//         -arcAngle1,
//         false
//     );

//     islandLeft.absarc(
//         arcCenterX,
//         0,
//         outerTrackRadius,
//         Math.PI + arcAngle2,
//         Math.PI - arcAngle2,
//         true
//     );

//     return islandLeft;
// }

function getMiddleIsland() {
    const islandMiddle = new THREE.Shape();

    islandMiddle.absarc(
        0,
        0,
        innerTrackRadius,
        0,
        Math.PI,
        true
    );

    islandMiddle.absarc(
        0,
        0,
        innerTrackRadius,
        0,
        2 * Math.PI,
        true
    );

    return islandMiddle;
}

// function getRightIsland() {
//     const islandRight = new THREE.Shape();

//     islandRight.absarc(
//         arcCenterX,
//         0,
//         innerTrackRadius,
//         Math.PI - arcAngle1,
//         Math.PI + arcAngle1,
//         true
//     );

//     islandRight.absarc(
//         -arcCenterX,
//         0,
//         outerTrackRadius,
//         -arcAngle2,
//         arcAngle2,
//         false
//     );

//     return islandRight;
// }

function getOuterField(mapWidth, mapHeight) {
    const field = new THREE.Shape();

    field.moveTo(-mapWidth / 2, -mapHeight / 2);
    field.lineTo(0, -mapHeight / 2);

    field.absarc(
        0,
        0,
        outerTrackRadius,
        -Math.PI / 2,
        3 * Math.PI / 2,
        true
    );

    field.lineTo(0, -mapHeight / 2);
    field.lineTo(mapWidth / 2, -mapHeight / 2);
    field.lineTo(mapWidth / 2, mapHeight / 2);
    field.lineTo(-mapWidth / 2, mapHeight / 2);

    return field;
}

const vehicleColors = [0x0443F9, 0xF904EA, 0x07FFE5, 0x00FF46, 0xECF708, 0x5F06C4, 0x91BFBC, 0xA17802]

export function Car(i) {
    const car = new THREE.Group();
    const carFrontTexture = getCarFrontTexture();
    carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
    carFrontTexture.rotation = Math.PI / 2;


    const carBackTexture = getCarFrontTexture();
    carBackTexture.center = new THREE.Vector2(0.5, 0.5);
    carBackTexture.rotation = -Math.PI / 2;


    const carLeftTexture = getCarSideTexture();
    carLeftTexture.flipY = false;

    const carRightTexture = getCarSideTexture();

    const backWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    backWheel.position.x = -18;
    backWheel.position.z = 6;
    car.add(backWheel);

    const frontWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    frontWheel.position.x = 18;
    frontWheel.position.z = 6;
    car.add(frontWheel);

    if (i === 2) {
        const main = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 15),
            new THREE.MeshLambertMaterial({ color: 0xF60C0C })
        )
        main.position.z = 12;
        car.add(main);
    }
    else {
        const main = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 15),
            new THREE.MeshLambertMaterial({ color: vehicleColors[Math.floor(Math.random() * vehicleColors.length)] })
        )
        main.position.z = 12;
        car.add(main);
    }

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }),
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftTexture }),
        new THREE.MeshLambertMaterial({ map: carRightTexture }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
        new THREE.MeshLambertMaterial({ color: 0xffffff })  //bottom
    ]);
    cabin.position.z = 25.5;
    cabin.position.x = -6;
    car.add(cabin);

    return car;
}


function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}