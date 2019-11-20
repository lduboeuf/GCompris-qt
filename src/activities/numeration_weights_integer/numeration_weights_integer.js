/* GCompris - numeration.js
 *
 * Copyright (C) 2019 Emmanuel Charruau <echarruau@gmail.com>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, see <https://www.gnu.org/licenses/>.
 */

.pragma library
.import QtQuick 2.6 as Quick

var currentLevel = 0
var numberOfLevel = 0    //?
var items

var numbersToConvert = []
var originalNumbersToConvert = []
var numbersCorrectlyAnswered = []
var scorePercentage = 0
var scorePourcentageStep = 0
var wrongAnswerAlreadyGiven = false
var selectedNumberWeightDragElementIndex = -1
var numberHasADecimalPart = false


var fullClassNamesConstantArray = ["Decimal Part","Unit class","Thousand class","Million class","Milliard class"]
var classNamesUsedArray

var numberClassesObj = {
    "Decimal Part": { name: qsTr("Decimal Part"), color: "black", dragkeys: "NumberClassKey"},
    "Unit class": { name: qsTr("Unit class"), color: "black", dragkeys: "NumberClassKey"},
    "Thousand class": { name: qsTr("Thousand class"), color: "black", dragkeys: "NumberClassKey"},
    "Million class": { name: qsTr("Million class"), color: "black", dragkeys: "NumberClassKey"},
    "Milliard class": { name: qsTr("Milliard class"), color: "black", dragkeys: "NumberClassKey"}
}

var numberWeightsColumnsArray = ["HundredColumn","TenColumn","UnitColumn"]

var numberWeightComponentConstantArray = ["UnitColumn","TenColumn","HundredColumn","Unit","Ten","Hundred","Thousand","TenThousand",
                                          "OneHundredThousand","OneMillion","TenMillion","OneHundredMillion",
                                          "OneMilliard","TenMilliard","OneHundredMilliard"]



var numberWeightDragArray = {
    "UnitColumn": { name: qsTr("Unit"), caption: "Unit", imageName: "", weightValue: "1", dragkeys: "numberWeightHeaderKey", color: "lightskyblue", selected: false },
    "TenColumn": { name: qsTr("Ten"), caption: "Ten", imageName: "", weightValue: "10", dragkeys: "numberWeightHeaderKey", color: "lightskyblue", selected: false },
    "HundredColumn": { name: qsTr("Hundred"), caption: "Hundred", imageName: "", weightValue: "100", dragkeys: "numberWeightHeaderKey", color: "lightskyblue", selected: false },
    "Unit": { name: qsTr("Unit"), caption: "", imageName: "unit.svg", weightValue: "1", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "Ten": { name: qsTr("Unit"), caption: "", imageName: "ten.svg", weightValue: "10", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "Hundred": { name: qsTr("Unit"), caption: "", imageName: "hundred.svg", weightValue: "100", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "Thousand": { name: qsTr("Unit"), caption: "1000", imageName: "weightCaption.svg", weightValue: "1000", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "TenThousand": { name: qsTr("Unit"), caption: "10 000", imageName: "weightCaption.svg", weightValue: "10000", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "OneHundredThousand": { name: qsTr("Unit"), caption: "100 000", imageName: "weightCaption.svg", weightValue: "100000", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "OneMillion": { name: qsTr("Unit"), caption: "1 000 000", imageName: "weightCaption.svg", weightValue: "1000000", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "TenMillion": { name: qsTr("Unit"), caption: "10 000 000", imageName: "weightCaption.svg", weightValue: "10000000", dragkeys: "numberWeightKey", color: "transparent", selected: false },
    "OneHundredMillion": { name: qsTr("Unit"), caption: "100 000 000", imageName: "weightCaption.svg", weightValue: "100000000", dragkeys: "numberWeightKey", color: "transparent" , selected: false },
    "OneMilliard": { name: qsTr("Unit"), caption: "1 000 000 000", imageName: "weightCaption.svg", weightValue: "1000000000", dragkeys: "numberWeightKey", color: "transparent" , selected: false },
    "TenMilliard": { name: qsTr("Unit"), caption: "10 000 000 000", imageName: "weightCaption.svg", weightValue: "10000000000", dragkeys: "numberWeightKey", color: "transparent" , selected: false },
    "OneHundredMilliard": { name: qsTr("Unit"), caption: "100 000 000 000", imageName: "weightCaption.svg", weightValue: "100000000000", dragkeys: "numberWeightKey", color: "transparent" , selected: false }
}

// for what is used name in numberWeightDragArray ?  //?


var numberClassTypeColumnsArray = ["Integer Part","Decimal Part"]


var tutorialInstructions = [
            {
                "instruction": qsTr("This activity teaches how to place numbers weights to represent a number quantity.")
                //"instructionQml" : "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial1.qml"
            },
            {
                "instruction": qsTr("Before to enter any number weights you have to enter the number classes (unit class only if numbers are less than 1000 and unit classes and thousand class if they are more than 999.")
                //"instructionQml" : "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial2.qml"
            },
            {
                "instruction": qsTr("Here using drag and drop we add the unit class and the thousand class."),
                "instructionQml": "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial1.qml"
            },
            {
                "instruction": qsTr("Binary system uses these numbers very efficiently, allowing to count from 0 to 255 with 8 bits only."),
                "instructionQml": "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial4.qml"
            },
            {
                "instruction": qsTr("Each bit adds a progressive value, corresponding to the powers of 2, ascending from right to left: bit 1 → 2⁰=1 , bit 2 → 2¹=2 , bit 3 → 2²=4 , bit 4 → 2³=8 , bit 5 → 2⁴=16 , bit 6 → 2⁵=32 , bit 7 → 2⁶=64 , bit 8 → 2⁷=128."),
                "instructionQml": "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial5.qml"
            },
            {
                "instruction":  qsTr("To convert a decimal 5 to a binary value, 1 and 4 are added."),
                "instructionQml": "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial6.qml"
            },
            {
                "instruction": qsTr("Their corresponding bits are set to 1, the others set to 0. Decimal 5 is equal to binary 101."),
                "instructionQml": "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial7.qml"
            },
            {
                "instruction": qsTr("This image will help you to compute bits' value."),
                "instructionQml": "qrc:/gcompris/src/activities/numeration_weights_integer/resource/tutorial5.qml"
            }
        ]


function removeClassInNumberClassesArray(className) {
    console.log(numberClassesArray)
    var index = numberClassesArray.indexOf(className);
    if (index > -1) {
       numberClassesArray.splice(index, 1);
    }
    console.log(numberClassesArray)
}

function removeClassInNumberClassesArray() {
    numberClassesArray.pop(numberClass)
}


function setNumberWeightHeader(numberWeightImageTile,imageName,caption,weightValue) {
    if ( imageName !== "") {
        numberWeightImageTile.source = "qrc:/gcompris/src/activities/numeration_weights_integer/resource/images/" + imageName
    }
    numberWeightImageTile.caption = caption
    numberWeightImageTile.weightValue = weightValue
}

function setNumberWeightComponent(numberWeightImageTile,imageName,caption,weightValue) {
    if ( imageName !== "") {
        numberWeightImageTile.source = "qrc:/gcompris/src/activities/numeration_weights_integer/resource/images/" + imageName
        numberWeightImageTile.caption = caption
        numberWeightImageTile.weightValue = weightValue
    }
}

function removeNumberWeightComponent(numberWeightImageTile) {
        numberWeightImageTile.source = ""
        numberWeightImageTile.caption = ""
        numberWeightImageTile.weightValue = ""
        numberWeightImageTile.border.color = "black"
}

function resetNumerationTable() {
    for (var i = 0; i<items.numberClassListModel.count; i++) {
        for (var j=0; j<3; j++) {
            for (var k=0; k<9; k++) {
                var numberWeightImageTile = items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightsDropTiles.numberWeightDropAreaGridRepeater.itemAt(k).numberWeightImageTile
                removeNumberWeightComponent(numberWeightImageTile)
            }
        }
    }
}


function getNumberWeightImageName(numberClassIndex, numberWeightIndex, numberWeightComponentIndex) {
    return items.numberClassDropAreaRepeater.itemAt(numberClassIndex).numberWeightsDropAreasRepeaterAlias.itemAt(numberWeightIndex).numberWeightsDropTiles.numberWeightDropAreaGridRepeater.itemAt(numberWeightComponentIndex).numberWeightImageTile.source
}

function getNumberWeightWeight(numberClassIndex, numberWeightIndex, numberWeightComponentIndex) {
    return items.numberClassDropAreaRepeater.itemAt(numberClassIndex).numberWeightsDropAreasRepeaterAlias.itemAt(numberWeightIndex).numberWeightsDropTiles.numberWeightDropAreaGridRepeater.itemAt(numberWeightComponentIndex).numberWeightImageTile.weightValue
}

function getNumberColumnWeight(numberClassName, numberWeightIndex) {

    var numberWeight = numberWeightsColumnsArray[numberWeightIndex]

    var numberColumnWeight
    console.log("**********************numberClassName",numberClassName)
    var columnWeightKey = numberClassName + "_" + numberWeight

    switch (columnWeightKey) {
        case "Unit class_UnitColumn":
          numberColumnWeight = 1
          break;
        case "Unit class_TenColumn":
          numberColumnWeight = 10
          break;
        case "Unit class_HundredColumn":
          numberColumnWeight = 100
          break;
        case "Thousand class_UnitColumn":
          numberColumnWeight = 1000
          break;
        case "Thousand class_TenColumn":
          numberColumnWeight = 10000
          break;
        case "Thousand class_HundredColumn":
          numberColumnWeight = 100000
          break;
        case "Million class_UnitColumn":
          numberColumnWeight = 1000000
          break;
        case "Million class_TenColumn":
          numberColumnWeight = 10000000
          break;
        case "Million class_HundredColumn":
          numberColumnWeight = 100000000
          break;
        case "Milliard class_UnitColumn":
          numberColumnWeight = 1000000000
          break;
        case "Milliard class_TenColumn":
          numberColumnWeight = 10000000000
          break;
        case "Milliard class_HundredColumn":
          numberColumnWeight = 100000000000
          break;
        default:
        console.log("Error in getNumberColumnWeight function");
    }
    return numberColumnWeight
}

function readNumerationTableEnteredValue() {
    var enteredValue = 0
    for (var i = 0; i<items.numberClassListModel.count; i++) {
        for (var j=0; j<3; j++) {
            for (var k=0; k<9; k++) {
                var numberWeightWeight = getNumberWeightWeight(i, j, k)
                if (numberWeightWeight !== "") {
                    enteredValue = enteredValue + parseInt(numberWeightWeight,10)
                }
            }
        }
    }
    console.log("entered value: " + enteredValue)
    return enteredValue
}

//check if the answer is correct
function checkAnswer() {
    items.instruction.hide()

    setWeightHeadersWeightCaptions()

    var allWeightsAreInTheRightColumns = areAllWeightsInTheRightColumns()
    if (!allWeightsAreInTheRightColumns) {
        items.instruction.text = qsTr("Some weights are not in the right column.")
        items.instruction.show()
        evaluateAndDisplayProgresses(false)
        return
    }


    var allNumberClassesAreInTheRightPosition = checkNumberClassesColumnsPositions()
    if (!allNumberClassesAreInTheRightPosition) {
        items.instruction.text = qsTr("Some number classes are not in the right position.")
        items.instruction.show()
        evaluateAndDisplayProgresses(false)
        return
    }

    var weightHeadersAreInRightColumn = checkNumberWeightHeadersPositions()
    if (!weightHeadersAreInRightColumn) {
        items.instruction.text = qsTr("Some weight headers are not in the right place.")
        items.instruction.show()
        evaluateAndDisplayProgresses(false)
        return
    }

    var valueEnteredIsCorrect = checkEnteredValue()
    if (!valueEnteredIsCorrect) {
        items.instruction.text = qsTr("The value you entered \"" + readNumerationTableEnteredValue() + "\" is not the one expected.")
        items.instruction.show()
        evaluateAndDisplayProgresses(false)
        return
    }
    else {
        if (evaluateAndDisplayProgresses(true)) {
            nextLevel()
        }
    }

}

function areAllWeightsInTheRightColumns() {
    var allWeightsAreInTheRightColumns = true
    for (var i = 0; i<items.numberClassListModel.count; i++) {
        for (var j=0; j<3; j++) {
            //console.log("getNumberColumnWeight: " + getNumberColumnWeight(i, j))
            var numberColumnWeight = getNumberColumnWeight(items.numberClassListModel.get(i).name, j)
            //console.log("-*-*-*-*-*numberColumnWeight",numberColumnWeight)
            for (var k=0; k<9; k++) {
                 var numberWeightWeight = getNumberWeightWeight(i, j, k)
                if (numberWeightWeight !== "") {
                    //console.log("get image names: " + getNumberWeightImageName(i, j, k))
                    //console.log("get getNumberWeightWeight: " + getNumberWeightWeight(i, j, k))
                    if (numberColumnWeight != numberWeightWeight) {
                        //console.log("Error: numberColumnWeight !== numberWeightWeight: " + numberColumnWeight + "/" + numberWeightWeight)
                        items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightsDropTiles.numberWeightDropAreaGridRepeater.itemAt(k).numberWeightComponentRectangle.border.color = "red"
                        allWeightsAreInTheRightColumns = false
                    }
                    else
                    {
                        items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightsDropTiles.numberWeightDropAreaGridRepeater.itemAt(k).numberWeightComponentRectangle.border.color = "black"
                        //console.log("Successfull :" + numberColumnWeight + "/" + numberWeightWeight)
                    }
                }
            }
        }
    }
    return allWeightsAreInTheRightColumns
}

function checkNumberWeightHeadersPositions() {
    var allNumbersInRightPositions = true
    for (var i = 0; i<items.numberClassListModel.count; i++) {
        for (var j=0; j<3; j++) {
            var numberWeightTypeDropped = items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightHeaderElement.textAlias
            var numberWeightType = items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightType
            //console.log("numberWeightType/numberWeightTypeDropped",numberWeightType+"/"+numberWeightTypeDropped)
            if (numberWeightTypeDropped !== numberWeightType) {
                items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightHeaderElement.border.width = 5
                items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightHeaderElement.textAlias = "tt"
                allNumbersInRightPositions = false
            }
            else items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightHeaderElement.border.width = 0
        }
    }
    return allNumbersInRightPositions
}


function setWeightHeadersWeightCaptions() {
    for (var i = 0; i<items.numberClassListModel.count; i++) {
        for (var j=0; j<3; j++) {
            var numberWeightType = items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightType
            items.numberClassDropAreaRepeater.itemAt(i).numberWeightsDropAreasRepeaterAlias.itemAt(j).numberWeightHeaderElement.textAlias = numberWeightType
        }
    }
}



function checkNumberClassesColumnsPositions() {
    var allClassesColumnsInRightPositions = true
    for (var i=items.numberClassListModel.count-1, classNamesUsedIndex=0 ; i>=0; i--,classNamesUsedIndex++) {
        if (items.numberClassListModel.get(i).name === classNamesUsedArray[classNamesUsedIndex]) {
            items.numberClassListModel.setProperty(i, "misplaced", false)
        }
        else {
            items.numberClassListModel.setProperty(i, "misplaced", true)
            allClassesColumnsInRightPositions = false
        }
    }
    return allClassesColumnsInRightPositions
}


function expectedAndEnteredValuesAreEquals() {
    var enteredValue = readNumerationTableEnteredValue()
    console.log("enteredValue/expected value:",enteredValue + " / " + parseInt(numbersToConvert[0],10))

    //test if entered value is equal to number expected
    if (enteredValue === parseInt(numbersToConvert[0],10)) {
        return true
    }
    else {
        return false
    }
}

function checkEnteredValue() {
    var _expectedAndEnteredValuesAreEquals = expectedAndEnteredValuesAreEquals()
    if (_expectedAndEnteredValuesAreEquals) {
        return true
    }
    else {
        return false
    }
}

function evaluateAndDisplayProgresses(correctAnswer) {
    if (correctAnswer) {
        wrongAnswerAlreadyGiven = false
        items.bonus.good("flower")
        console.log("correct: scorePercentage before incrementation",scorePercentage)
        numbersCorrectlyAnswered.push(numbersToConvert.shift())  //remove first element and copy it in numbersCorrectlyAnswered
        scorePercentage = scorePercentage + scorePourcentageStep
        console.log("correct: scorePercentage after incrementation",scorePercentage)
        items.progressBar.value = scorePercentage
        if (scorePercentage > 97) {
            return true
        }
        items.numberToConvertRectangle.text = numbersToConvert[0]
        console.log("original NumbersToConvert: " + originalNumbersToConvert)
        console.log("NumbersToConvert: " + numbersToConvert)
        console.log("numbersCorrectlyAnswered: " + numbersCorrectlyAnswered)
        return
    }
    else {
        items.bonus.bad("flower")
        items.numberToConvertRectangle.text = numbersToConvert[0]
        console.log("incorrect: scorePercentage before incrementation",scorePercentage)
        console.log("wrongAnswerAlreadyGiven: ", wrongAnswerAlreadyGiven)
        if (wrongAnswerAlreadyGiven === false) {
            scorePercentage = scorePercentage - scorePourcentageStep
            if (scorePercentage < 0) scorePercentage = 0
            items.progressBar.value = scorePercentage
            if (numbersToConvert.length < 2) {
                numbersToConvert.splice(2, 0, numbersCorrectlyAnswered[Math.floor(Math.random() * numbersCorrectlyAnswered.length)])
            }
            console.log("number to convert before splice: ",numbersToConvert)
            numbersToConvert.splice(2, 0, numbersToConvert[0]);
            console.log("number to convert after splice: ",numbersToConvert)
            wrongAnswerAlreadyGiven = true
            console.log("incorrect: scorePercentage after incrementation",scorePercentage)
        }
        console.log("NumbersToConvert length: " + numbersToConvert.length)
        console.log("original NumbersToConvert: " + originalNumbersToConvert)
        console.log("NumbersToConvert: " + numbersToConvert)
        console.log("numbersCorrectlyAnswered: " + numbersCorrectlyAnswered)
        return false
    }
}

function start(items_) {
    items = items_
    currentLevel = 0

    setNumberWeightDragListModel(numberWeightComponentConstantArray)
    initLevel()

    numberOfLevel = items.levels.length  // ?
}


function setNumberClassTypeListModel() {
    items.numberClassTypeModel.append({"numberClassType": "Integer Part", "numberClassTypeHeaderWidth": 0})
    if (hasNumberADecimalPart()) {
        addDecimalHeaderToNumberClassTypeModel()
    }
}


function setClassNamesUsedArray(fullClassNamesArray) {
    var smallerNumberClass = items.levels[currentLevel].smallerNumberClass
    var biggerNumberClass = items.levels[currentLevel].biggerNumberClass
    if (!isClassNamePresentInfullClassNamesArray(fullClassNamesArray, smallerNumberClass)) {
        return fullClassNamesConstantArray
    }
    if (!isClassNamePresentInfullClassNamesArray(fullClassNamesArray, biggerNumberClass)) {
        return fullClassNamesConstantArray
    }
    return fullClassNamesArray.slice(fullClassNamesArray.indexOf(smallerNumberClass),fullClassNamesArray.indexOf(biggerNumberClass)+1)
}

function isClassNamePresentInfullClassNamesArray(fullClassNamesArray, className) {
    if (fullClassNamesArray.indexOf(className) !== -1) {
        return true
    } else {
        items.warningRectangle.text = qsTr("The class name \"" + className + "\" is not present in the available list: \"" + fullClassNamesArray+ "\". Check your configuration file (lower case or uppercase error?).")
        items.warningRectangle.show()
        return false
    }
}

function hasNumberADecimalPart() {
    for (var i=0; i<classNamesUsedArray.length; i++) {
        var classNameStr = classNamesUsedArray[i]
        if (classNameStr === "Decimal Part") {
            return true
        } else {
            return false
        }
    }
}

function updateIntegerAndDecimalHeaderWidth() {
    if (numberHasADecimalPart) {
        if (items.numberClassListModel.count === 1) {
            items.numberClassTypeModel.set(0,{"numberClassTypeHeaderWidth": 0})
            items.numberClassTypeModel.set(1,{"numberClassTypeHeaderWidth": items.mainZoneArea.width})
        } else {
            items.numberClassTypeModel.set(0,{"numberClassTypeHeaderWidth": items.mainZoneArea.width - items.mainZoneArea.width / items.numberClassListModel.count})
            items.numberClassTypeModel.set(1,{"numberClassTypeHeaderWidth": items.mainZoneArea.width / items.numberClassListModel.count})
        }
    } else {
        console.log("items.numberClassTypeModel.get(0).numberClassTypeHeaderWidth",items.numberClassTypeModel.get(0).numberClassTypeHeaderWidth)
        items.numberClassTypeModel.set(0,{"numberClassTypeHeaderWidth": items.mainZoneArea.width})
        console.log("items.numberClassTypeModel.get(0).numberClassTypeHeaderWidth",items.numberClassTypeModel.get(0).numberClassTypeHeaderWidth)
    }
}


function setNumberClassDragListModel(fullClassNamesConstantArray) {
    classNamesUsedArray = setClassNamesUsedArray(fullClassNamesConstantArray)
    numberHasADecimalPart = hasNumberADecimalPart()
    setNumberClassTypeListModel()
    updateIntegerAndDecimalHeaderWidth()
    console.log("classNamesUsed " + classNamesUsedArray)
    items.numberClassDragListModel.clear()
    for (var i=0; i<classNamesUsedArray.length; i++) {
        var classNameStr = classNamesUsedArray[i]
        if (classNameStr !== "Decimal Part") {
            items.numberClassDragListModel.append({"name": numberClassesObj[classNameStr]["name"],
                                                    "color": numberClassesObj[classNameStr]["color"],
                                                    "dragkeys": numberClassesObj[classNameStr]["dragkeys"]})
        }
    }
}

function setNumberWeightDragListModel(numberWeightComponentConstantArray) {
    for (var i=0; i<numberWeightComponentConstantArray.length; i++) {
        var weightNameStr = numberWeightComponentConstantArray[i]
        console.log("numberWeightsColumn to add " + weightNameStr)
        console.log("numberWeightDragArray[weightNameStr][selected]" + numberWeightDragArray[weightNameStr]["selected"])

        items.numberWeightDragListModel.append({"name": numberWeightDragArray[weightNameStr]["name"],
                                                "imageName": numberWeightDragArray[weightNameStr]["imageName"],
                                                "dragkeys": numberWeightDragArray[weightNameStr]["dragkeys"],
                                                "weightValue": numberWeightDragArray[weightNameStr]["weightValue"],
                                                "caption": numberWeightDragArray[weightNameStr]["caption"],
                                                "color": numberWeightDragArray[weightNameStr]["color"],
                                                "selected": numberWeightDragArray[weightNameStr]["selected"]
                                               })
    }
}

function selectNumberWeightDragElement(elementIndex) {
    console.log("--*-* " + items.numberWeightDragListModel.get(elementIndex).selected)
    if (items.numberWeightDragListModel.get(elementIndex).selected === true) {
        items.numberWeightDragListModel.setProperty(elementIndex, "selected", false)
        selectedNumberWeightDragElementIndex = -1
    }
    else {
        unselectAllNumberWeightDragElement()
        items.numberWeightDragListModel.setProperty(elementIndex, "selected", true)
        selectedNumberWeightDragElementIndex = elementIndex
    }
}

function unselectAllNumberWeightDragElement() {
    for (var i=0; i<items.numberWeightDragListModel.count; i++) {
        items.numberWeightDragListModel.setProperty(i, "selected", false)
    }
}

function stop() {
}


function addDecimalHeaderToNumberClassTypeModel() {
    items.numberClassListModel.append({"name": "Decimal Part", "misplaced": false})
    items.numberClassTypeModel.append({"numberClassType":  "Decimal Part", "numberClassTypeHeaderWidth": 0})
}


function appendClassNameColumn(className,element_src,misplaced) {
    items.numberClassListModel.insert(0,{"name": className, "element_src": element_src, "misplaced": false})
    updateIntegerAndDecimalHeaderWidth()
}


function initLevel() {
    console.log("start init ")

    items.bar.level = currentLevel + 1
    items.instruction.text = items.levels[currentLevel].objective
    items.instruction.show()

    console.log("currentLevel: " + currentLevel)
    numbersToConvert = items.levels[currentLevel].numbers
    originalNumbersToConvert = numbersToConvert.slice()
    console.log("numbersToConvert: " + numbersToConvert)
    scorePercentage = 0
    items.progressBar.value = scorePercentage
    scorePourcentageStep = Math.round((100 / numbersToConvert.length))

    items.numberToConvertRectangle.text = numbersToConvert[0]
    numbersCorrectlyAnswered = []

    resetNumerationTable()
    setNumberClassDragListModel(fullClassNamesConstantArray)

    console.log("stop init ")
}

function nextLevel() {
    if(numberOfLevel <= ++currentLevel) {
        currentLevel = 0
    }
    initLevel();
}

function previousLevel() {
    if(--currentLevel < 0) {
        currentLevel = numberOfLevel - 1      //?
    }
    initLevel();
}