let Minecraft = {};
let board = document.getElementById('gameContainer');


Minecraft.createBoard = function () {
    board.style.display = 'block';
    let backgroundClass;
    let numOfRows = 10;
    boxElem = document.querySelector('.box')
    //console.log(boxElem.css);
    let numOfCol = 20;
    let treeSpots = [3, 9, 10, 14, 18]
    let treeRoot = treeSpots[Math.floor(Math.random()*treeSpots.length)]
    let stoneSpots = [1,5,6,7,12,13,16]
    let firstStoneRoot = stoneSpots[Math.floor(Math.random()*stoneSpots.length)]
    let secondStoneRoot = stoneSpots[Math.floor(Math.random()*stoneSpots.length)]
    let thirdStoneRoot = stoneSpots[Math.floor(Math.random()*stoneSpots.length)]
    for (var i = 0; i < numOfRows; i++) {
        let newRow = document.createElement('div');
        newRow.className = 'rows';
        backgroundClass = Minecraft.getBoxProperty(i);
        for (var j = 0; j < numOfCol; j++) {
            let box = document.createElement('div');
            box.classList.add(backgroundClass);
            box.classList.add('box');
            box.setAttribute('row', i);
            box.setAttribute('col', j);
            if (i == 5 && j == treeRoot) {
                Minecraft.addTree(box);
            }
            if (i == 5 && j == firstStoneRoot){
                Minecraft.addDoubleStone(box)
            }
            if (i == 5 && j == secondStoneRoot && firstStoneRoot != secondStoneRoot){
                Minecraft.addDoubleStone(box)
            }
            if (i == 5 && j == thirdStoneRoot && thirdStoneRoot != firstStoneRoot && thirdStoneRoot != secondStoneRoot){
                Minecraft.addSingleStone(box)
            }
            if (box.classList.contains('grass') || box.classList.contains('ground')) {
                box.addEventListener('click', Minecraft.clickBox);
            }
            newRow.append(box);
        }
        board.appendChild(newRow);
    }
    Minecraft.resources = {
        wood: 0,
        stone: 0,
        ground: 0,
        grass: 0
    }
    Minecraft.tools ={
        axe : 'wood',
        shovel : 'ground',
        pickaxe : 'stone'
    }
}

Minecraft.getBoxProperty = function (rowNumber) {
    let boxClass;
    switch (rowNumber) {
        case 0: case 1: case 2: case 3: case 4: case 5:
            boxClass = 'sky';
            break;
        case 6:
            boxClass = 'grass';
            break;
        case 7: case 8: case 9:
            boxClass = 'ground';
            break;
    }
    return boxClass;
}

Minecraft.clickBox = function (e) {
    let eventBox = e.target;
    if (Minecraft.isRemoveable(eventBox)) {
        if (eventBox.classList.contains('grass')) {
            eventBox.classList.remove('grass');
            Minecraft.addResource('grass');
        } else if (eventBox.classList.contains('ground')) {
            eventBox.classList.remove('ground');
            Minecraft.addResource('ground');
        }
    }
    if (Minecraft.isBuilding) {
        Minecraft.build(eventBox);
    }

    if (eventBox.classList.contains('wood')) {
        eventBox.classList.remove('wood');
        Minecraft.addResource('wood');
    }
    if (eventBox.classList.contains('stone')) {
        eventBox.classList.remove('stone');
        Minecraft.addResource('stone');
    }
}


Minecraft.getRow = function (box) {
    return box.getAttribute('row');
}

Minecraft.getCol = function (box) {
    return box.getAttribute('col');
}

Minecraft.isOpenSpace = function (box) {
    let isOpen = true;
    if (box != "" && box != undefined) {

        if (box.classList.contains('grass')) {
            isOpen = false;
        } else if (box.classList.contains('ground')) {
            isOpen = false;
        }else if(box.classList.contains('stone')){
            isOpen=false;
        }else if(box.classList.contains('wood')){
            isOpen=false;
        }
    } else {
        isOpen = false;
    }

    return isOpen;
}

Minecraft.isRemoveable = function (box) {

    let boxRight = Minecraft.getRightBox(box);
    let boxLeft = Minecraft.getLeftBox(box);
    let boxTop = Minecraft.getTopBox(box);
    let boxBottom = Minecraft.getBottomBox(box);

    if (Minecraft.isOpenSpace(boxRight) || Minecraft.isOpenSpace(boxLeft) ||
        Minecraft.isOpenSpace(boxTop) || Minecraft.isOpenSpace(boxBottom)) {
        return true;
    } else {
        return false;
    }

}

Minecraft.getTopBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList == boxRow - 1) && (colInBoxList == boxCol)) {
            return boxsList[i];
        }
    }
}
Minecraft.getBottomBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList - 1 == boxRow) && (colInBoxList == boxCol)) {
            return boxsList[i];
        }
    }
}
Minecraft.getLeftBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList == boxRow) && (colInBoxList == boxCol - 1)) {
            return boxsList[i];
        }
    }
    console.log('here');
}
Minecraft.getBoxes = function(box){
    return {
        top: Minecraft.getTopBox(box),
        bottom: Minecraft.getBottomBox(box),
        left: Minecraft.getLeftBox(box),
        right: Minecraft.getRightBox(box),
    } 
}
Minecraft.getRightBox = function (currentBox) {
    let boxsList = document.getElementsByClassName('box');
    let boxRow = Minecraft.getRow(currentBox);
    let boxCol = Minecraft.getCol(currentBox);

    for (var i = 0; i < boxsList.length; i++) {
        let rowInBoxList = Minecraft.getRow(boxsList[i]);
        let colInBoxList = Minecraft.getCol(boxsList[i]);

        if ((rowInBoxList == boxRow) && (colInBoxList - 1 == boxCol)) {
            return boxsList[i];
        }
    }
}
Minecraft.createRow = function (rowId) {
    for (let i = 0; i < 6; i++) {
        let newDiv = document.createElement('div');
        newDiv.className = 'tool';
        rowId.append(newDiv);
    }
}
Minecraft.createToolBox = function () {
    topToolBox = document.getElementById('top-toolBox');
    bottomToolBox = document.getElementById('bottom-toolBox');
    Minecraft.createRow(topToolBox);
    Minecraft.createRow(bottomToolBox);
    Minecraft.tools = document.getElementsByClassName('tool');
    Minecraft.createResources();
}
Minecraft.createResources = function () {
    Minecraft.grassResource = Minecraft.tools[0];
    Minecraft.grassResource.classList.add('grassResource');
    Minecraft.grassResource.setAttribute('resource', 'grass');
    Minecraft.groundResource = Minecraft.tools[1];
    Minecraft.groundResource.classList.add('groundResource');
    Minecraft.groundResource.setAttribute('resource', 'ground');
    Minecraft.woodResource = Minecraft.tools[6];
    Minecraft.woodResource.classList.add('woodResource');
    Minecraft.woodResource.setAttribute('resource', 'wood');
    Minecraft.stoneResource = Minecraft.tools[7];
    Minecraft.stoneResource.classList.add('stoneResource');
    Minecraft.stoneResource.setAttribute('resource', 'stone');
    Minecraft.grassResource.innerText = Minecraft.resources.grass;
    Minecraft.groundResource.innerText = Minecraft.resources.ground;
    Minecraft.woodResource.innerText = Minecraft.resources.wood;
    Minecraft.stoneResource.innerText = Minecraft.resources.stone;
    Minecraft.createToolsinToolBox();
    for (let i = 0; i < Minecraft.tools.length; i++) {
        Minecraft.tools[i].addEventListener('click', Minecraft.handleBuild)
    }
}
Minecraft.createToolsinToolBox=function(){
    	Minecraft.axeTool = Minecraft.tools[3];
    	Minecraft.axeTool.classList.add('axe');
    	Minecraft.shovelTool = Minecraft.tools[4];
    	Minecraft.shovelTool.classList.add('shovel');
    	Minecraft.pickaxeTool = Minecraft.tools[5];
    	Minecraft.pickaxeTool.classList.add('pickaxe');
}

Minecraft.handleBuild = function (e) {
    Minecraft.currentResource = e.target.getAttribute('resource');
    switch (Minecraft.currentResource) {
        case 'wood': case 'stone': case 'grass': case 'ground': {
            Minecraft.isBuilding = true;
        }
            break;
    }
}
Minecraft.addResource = function (type) {
    Minecraft.resources[type] += 1;
    let typeResource = type + 'Resource';
    Minecraft[typeResource].innerText = Minecraft.resources[type];
}
Minecraft.removeResource = function (type) {
    if (Minecraft.resources[type] == 0) {
        return;
    }
    Minecraft.resources[type] -= 1;
    Minecraft.lastResource = type;
    let typeResource = type + 'Resource';
    Minecraft[typeResource].innerText = Minecraft.resources[type];
    Minecraft.chosenResource = true;
}
Minecraft.build = function (box) {
    box.classList.add(Minecraft.currentResource);
    Minecraft.removeResource(Minecraft.currentResource);  
    Minecraft.isBuilding = false;
    Minecraft.chosenResource = false;  
}
Minecraft.start = function () {
    Minecraft.createBoard();
    Minecraft.createToolBox();
}

Minecraft.setIntroScreen = function () {
    board.style.display = 'none';
    let showIntro = document.getElementById("tutorialButton");
    let hideButton = document.getElementById('closeTutorial');
    let tutorialWrapper = document.getElementById('tutorialWrapper');
    let newGameButton = document.getElementById('newGameButton');
    let introScreen = document.getElementById('intro')

    showIntro.addEventListener('click', function () {
        tutorialWrapper.style.display = 'flex';
    });
    hideButton.addEventListener('click', function () {
        tutorialWrapper.style.display = "none";
    })
    newGameButton.addEventListener('click', function () {
        introScreen.style.display = "none";
    })
    newGameButton.addEventListener('click', Minecraft.start)

}

Minecraft.addTree = function (startingBox) {
    let firstWood = startingBox;
    let secondWood = Minecraft.getTopBox(firstWood);
    let thirdWood = Minecraft.getTopBox(secondWood);
    let middleLeaf = Minecraft.getTopBox(thirdWood);
    let middleRightLeaf = Minecraft.getRightBox(middleLeaf);
    let middleLeftLeaf = Minecraft.getLeftBox(middleLeaf);
    let topLeaf = Minecraft.getTopBox(middleLeaf);
    let topRightLeft = Minecraft.getRightBox(topLeaf);
    let topLeftLeft = Minecraft.getLeftBox(topLeaf);

    firstWood.classList.add('wood');
    firstWood.addEventListener('click', Minecraft.clickBox);
    secondWood.classList.add('wood');
    secondWood.addEventListener('click', Minecraft.clickBox);
    thirdWood.classList.add('wood');
    thirdWood.addEventListener('click', Minecraft.clickBox);
    middleLeaf.classList.add('leaves');
    middleRightLeaf.classList.add('leaves');
    middleLeftLeaf.classList.add('leaves');
    topLeaf.classList.add('leaves');
    topRightLeft.classList.add('leaves');
    topLeftLeft.classList.add('leaves');
}

Minecraft.addDoubleStone = function (startingBox){
    let firstStone = startingBox;
    let secondStone = Minecraft.getTopBox(startingBox);

    firstStone.classList.add('stone');
    firstStone.addEventListener('click',Minecraft.clickBox);
    secondStone.classList.add('stone');
    secondStone.addEventListener('click',Minecraft.clickBox);
}
Minecraft.addSingleStone = function (startingBox){
    let firstStone = startingBox;
    
    firstStone.classList.add('stone');
    firstStone.addEventListener('click',Minecraft.clickBox);
}
Minecraft.setIntroScreen();


