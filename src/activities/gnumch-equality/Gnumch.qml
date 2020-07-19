/* GCompris - Gnumch.qml
*
* Copyright (C) 2014 Manuel Tondeur <manueltondeur@gmail.com>
*
* Authors:
*   Joe Neeman (spuzzzzzzz@gmail.com) (GTK+ version)
*   Manuel Tondeur <manueltondeur@gmail.com> (Qt Quick port)
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
import QtQuick 2.6
import GCompris 1.0

import "../../core"
import "gnumch-equality.js" as Activity

ActivityBase {
    id: activity

    property string type
    property bool useMultipleDataset: false

    focus: true

    onStart: {}
    onStop: {}

    pageComponent: Rectangle {
        id: background

        function checkAnswer() {
            if (!muncher.movable)
                return

            // Case already discovered
            if (!modelCells.get(muncher.index).show) {
                return
            }

            muncher.eating = true
            // Set the cell invisible if it's the correct answer.
            if (Activity.isAnswerCorrect(muncher.index)) {
                modelCells.get(muncher.index).show = false
                if (gridPart.isLevelDone()) {
                    stopLevel();
                }
            } else {
                modelCells.get(muncher.index).show = false
                muncher.getCaught(muncher.index)
            }
        }

        function nextLevel() {
            Activity.nextLevel();
            initLevel();
        }

        function previousLevel() {
            Activity.previousLevel();
            initLevel();
        }

        function initLevel() {
            topPanel.life.opacity = 1;
            forceActiveFocus();
            Activity.initLevel();
            items.operator = Activity._operator;
            topPanel.goal = Activity.getGoal();
            stopLevel();

            if(useMultipleDataset) {
                if(items.levels[Activity._currentLevel].spawnMonsters)
                    spawningMonsters.restart();
            }
            else if (Activity._currentLevel !== 0) {
                spawningMonsters.restart();
            }
        }

        function stopLevel() {
            monsters.destroyAll();
            spawningMonsters.stop();
            timerActivateWarn.stop();
        }

        anchors.fill: parent
        color: "#ABCDEF"
        signal start
        signal stop

        Component.onCompleted: {
            dialogActivityConfig.initialize()
            activity.start.connect(start)
            activity.stop.connect(stop)
        }

        QtObject {
            id: items
            property var levels: activity.datasetLoader ? activity.datasetLoader.data : ""
            property alias modelCells: modelCells
            property alias bonus: bonus
            property alias bar: topPanel.bar
            property string operator
        }

        onStart: {
            Activity.start(items, type, useMultipleDataset);
            initLevel();
        }
        onStop: {
            monsters.destroyAll()
            muncher.init()
            Activity.stop()
        }

        Keys.onRightPressed: muncher.moveTo(muncher.moveRight)
        Keys.onLeftPressed: muncher.moveTo(muncher.moveLeft)
        Keys.onDownPressed: muncher.moveTo(muncher.moveDown)
        Keys.onUpPressed: muncher.moveTo(muncher.moveUp)

        Keys.onSpacePressed: {
            checkAnswer()
        }

        Keys.onReturnPressed: {
            warningRect.hideWarning()
        }

        // Debug utility.
//        Keys.onAsteriskPressed: {
//            nextLevel()
//        }

        onWidthChanged: {
            positionTimer.restart()
        }

        Timer {
            id: positionTimer

            interval: 100

            onTriggered: {
                muncher.updatePosition()
                var children = monsters.children
                for (var it = 0; it < children.length; it++) {
                    children[it].updatePosition()
                }
            }
        }

        Connections {
            target: warningRect.mArea
            onClicked: warningRect.hideWarning()
        }

        Rectangle {
            id: gridPart

            width: background.width
            height: background.height / 7 * 6
            border.color: "black"
            border.width: 2
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: topPanel.top
            radius: 5

            function isLevelDone() {
                for (var it = 0; it < modelCells.count; it++) {
                    if (Activity.isAnswerCorrect(it) && modelCells.get(it).show) {
                        return false
                    }
                }
                bonus.good("gnu")
                return true
            }

            MultiPointTouchArea {
                anchors.fill: parent
                touchPoints: [ TouchPoint { id: point1 } ]
                property real startX
                property real startY
                // Workaround to avoid having 2 times the onReleased event
                property bool started

                onPressed: {
                    startX = point1.x
                    startY = point1.y
                    started = true
                }

                onReleased: {
                    if(!started)
                        return false
                    var moveX = point1.x - startX
                    var moveY = point1.y - startY
                    // Find the direction with the most move
                    if(Math.abs(moveX) * ApplicationInfo.ratio > 10 &&
                            Math.abs(moveX) > Math.abs(moveY)) {
                        if(moveX > 10 * ApplicationInfo.ratio)
                            muncher.moveTo(muncher.moveRight)
                        else if(moveX < -10 * ApplicationInfo.ratio)
                            muncher.moveTo(muncher.moveLeft)
                        else
                            background.checkAnswer()
                    } else if(Math.abs(moveY) * ApplicationInfo.ratio > 10 &&
                              Math.abs(moveX) < Math.abs(moveY)) {
                        if(moveY > 10 * ApplicationInfo.ratio)
                            muncher.moveTo(muncher.moveDown)
                        else if(moveY < -10 * ApplicationInfo.ratio)
                            muncher.moveTo(muncher.moveUp)
                        else
                            background.checkAnswer()
                    } else {
                        // No move, just a tap or mouse click
                        if(point1.x > muncher.x + muncher.width)
                            muncher.moveTo(muncher.moveRight)
                        else if(point1.x < muncher.x)
                            muncher.moveTo(muncher.moveLeft)
                        else if(point1.y < muncher.y)
                            muncher.moveTo(muncher.moveDown)
                        else if(point1.y > muncher.y + muncher.height)
                            muncher.moveTo(muncher.moveUp)
                        else
                            background.checkAnswer()
                    }
                    started = false
                }
            }

            Muncher {
                id: muncher
                audioEffects: activity.audioEffects
            }

            Item {
                id: monsters

                function setMovable(movable) {
                    var children = monsters.children
                    for (var it = 0; it < children.length; it++) {
                        children[it].movable = movable
                    }
                }

                function destroyAll() {
                    var children = monsters.children
                    for (var it = 0; it < children.length; it++) {
                        children[it].destroy()
                    }
                }

                function isThereAMonster(position) {
                    var children = monsters.children
                    for (var it = 0; it < children.length; it++) {
                        if (children[it].index == position) {
                            children[it].eating = true
                            return true
                        }
                    }
                    return false
                }

                function checkOtherMonster(position) {
                    var children = monsters.children
                    var count = 0
                    for (var it = 0; it < children.length; it++) {
                        if (children[it].index == position
                                && !children[it].movingOn) {
                            count++
                            if (count > 1) {
                                children[it].opacity = 0
                            }
                        }
                    }
                }
            }

            // Show an hint to show that can move by swiping anywhere
            Image {
                anchors {
                    right: parent.right
                    bottom: parent.bottom
                    margins: 12
                }
                source: "qrc:/gcompris/src/core/resource/arrows_move.svg"
                sourceSize.width: 140
                opacity: topPanel.bar.level == 1 && ApplicationInfo.isMobile ? 0.8 : 0
            }

            Timer {
                id: spawningMonsters

                interval: Activity.genTime()
                running: false
                repeat: true

                onTriggered: {
                    interval = Activity.genTime()
                    timerActivateWarn.start()
                    var comp = Qt.createComponent("qrc:/gcompris/src/activities/gnumch-equality/" +
                                                  Activity.genMonster(
                                                      ) + ".qml")
                    if (comp.status === Component.Ready) {
                        var direction = Math.floor(Math.random() * 4)
                        var result = Activity.genPosition(direction,
                                                          grid.cellWidth,
                                                          grid.cellHeight)
                        var reggie = comp.createObject(monsters, {
                                                           audioEffects: activity.audioEffects,
                                                           direction: direction,
                                                           player: muncher,
                                                           index: result[0],
                                                           x: result[1],
                                                           y: result[2]
                                                       })
                        reggie.opacity = 1
                    }
                }
            }

            Timer {
                id: timerActivateWarn

                interval: spawningMonsters.interval - 2000
                running: spawningMonsters.running

                onTriggered: {
                    warnMonsters.opacity = 1
                }
            }

            GridView {
                id: grid

                anchors.fill: parent
                cellHeight: (parent.height - 2) / 6
                cellWidth: (parent.width - 2) / 6
                interactive: false
                focus: false

                model: modelCells
                delegate: gridDelegate.delegate
            }

            CellDelegate {
                id: gridDelegate
            }

            ListModel {
                id: modelCells

                function regenCell(position) {
                    if (type === "equality" || type === "inequality") {
                        var terms
                        if (items.operator === " + ") {
                            terms = Activity.splitPlusNumber(
                                        Activity.genNumber())
                        } else if (items.operator === " - ") {
                            terms = Activity.splitMinusNumber(
                                        Activity.genNumber())
                        } else if (items.operator === " * ") {
                            terms = Activity.splitMultiplicationNumber(
                                        Activity.genNumber())
                        } else if (items.operator === " / ") {
                            terms = Activity.splitDivisionNumber(
                                        Activity.genNumber())
                        }
                        modelCells.setProperty(position, "number1", terms[0])
                        modelCells.setProperty(position, "number2", terms[1])
                    } else if (type == "multiples") {
                        modelCells.setProperty(position, "number1", Activity.genMultiple())
                    } else if (type == "factors") {
                        modelCells.setProperty(position, "number1", Activity.genFactor())
                    }

                    modelCells.setProperty(position, "show", true)
                    gridPart.isLevelDone()
                }
            }
        }

        DialogChooseLevel {
            id: dialogActivityConfig
            currentActivity: activity.activityInfo
            onClose: {
                home()
            }

            onSaveData: {
                levelFolder = dialogActivityConfig.chosenLevels
                currentActivity.currentLevels = dialogActivityConfig.chosenLevels
                ApplicationSettings.setCurrentLevels(currentActivity.name, dialogActivityConfig.chosenLevels)
            }

            onStartActivity: {
                background.stop()
                background.start()
            }
        }

        TopPanel {
            id: topPanel
            goal: Activity.getGoal()
        }

        WarnMonster {
            id: warnMonsters
        }

        DialogHelp {
            id: dialogHelp
            onClose: home()
        }

        Warning {
            id: warningRect
        }

        Bonus {
            id: bonus

            onStop: {
                if(isWin === true)
                    parent.nextLevel();
            }
        }
    }
}
