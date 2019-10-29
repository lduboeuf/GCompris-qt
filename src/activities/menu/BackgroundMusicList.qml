/* GCompris - BackgroundMusicList.qml
 *
 * Copyright (C) 2019 Aman Kumar Gupta <gupta2140@gmail.com>
 *
 * Authors:
 *   Aman Kumar Gupta <gupta2140@gmail.com> (Qt Quick)
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
import QtQuick.Controls 1.5
import GCompris 1.0

import "../../core"
import "qrc:/gcompris/src/core/core.js" as Core

Rectangle {
    id: dialogBackground
    color: "#696da3"
    border.color: "black"
    border.width: 1
    z: 10000
    anchors.fill: parent
    visible: false

    Keys.onEscapePressed: close()

    signal close

    property bool horizontalLayout: dialogBackground.width >= dialogBackground.height
    property int margin30: Math.round(30 * ApplicationInfo.ratio)

    Row {
        spacing: 2
        Item { width: 10; height: 1 }

        Column {
            spacing: 10
            anchors.top: parent.top
            Item { width: 1; height: 10 }
            Rectangle {
                id: titleRectangle
                color: "#e6e6e6"
                radius: 6.0
                width: dialogBackground.width - 30
                height: title.height * 1.2
                border.color: "black"
                border.width: 2

                GCText {
                    id: title
                    text: qsTr("Background music")
                    width: dialogBackground.width - 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    color: "black"
                    fontSize: 20
                    font.weight: Font.DemiBold
                    wrapMode: Text.WordWrap
                }
            }

            Rectangle {
                color: "#e6e6e6"
                radius: 6.0
                width: dialogBackground.width - 30
                height: dialogBackground.height - 100
                border.color: "black"
                border.width: 2
                anchors.margins: 100

                Flickable {
                    id: flickableList
                    anchors.fill: parent
                    anchors.margins: 10 * ApplicationInfo.ratio
                    contentHeight: musicGrid.height + musicInfo.height + margin30
                    flickableDirection: Flickable.VerticalFlick
                    clip: true

                    Flow {
                        id: musicGrid
                        width: parent.width
                        spacing: 10 * ApplicationInfo.ratio
                        anchors.horizontalCenter: parent.horizontalCenter

                        Repeater {
                            model: dialogActivityConfig.configItem ? dialogActivityConfig.configItem.allBackgroundMusic : 0

                            Item {
                                width: (musicGrid.width - margin30)  * 0.33
                                height: title.height * 2

                                Button {
                                    text: modelData.slice(0, modelData.lastIndexOf('.'))
                                    onClicked: {
                                        if(dialogActivityConfig.configItem.filteredBackgroundMusic.indexOf(modelData) == -1) {
                                            // Keep the filtered playlist sorted w.r.t to their positions in "allBackgroundMusic" to maintain their playing order
                                            var musicOriginalPosition = dialogActivityConfig.configItem.allBackgroundMusic.indexOf(modelData)
                                            var i = 0
                                            while(i < dialogActivityConfig.configItem.filteredBackgroundMusic.length) {
                                                var filteredMusicName = dialogActivityConfig.configItem.filteredBackgroundMusic[i]
                                                if(dialogActivityConfig.configItem.allBackgroundMusic.indexOf(filteredMusicName) >  musicOriginalPosition)
                                                    break
                                                i++
                                            }
                                            dialogActivityConfig.configItem.filteredBackgroundMusic.splice(i, 0, modelData)
                                        }
                                        else {
                                            dialogActivityConfig.configItem.filteredBackgroundMusic.splice(dialogActivityConfig.configItem.filteredBackgroundMusic.indexOf(modelData), 1)
                                            if(dialogActivityConfig.configItem.filteredBackgroundMusic == 0) {
                                                dialogActivityConfig.configItem.filteredBackgroundMusic.push(modelData)
                                                selectedIcon.visible = false
                                                Core.showMessageDialog(dialogBackground,
                                                    qsTr("Disable the background music if you don't want to play them."),
                                                    "", null,
                                                    "", null,
                                                    null
                                                );
                                            }
                                        }
                                        
                                        selectedIcon.visible = !selectedIcon.visible
                                    }
                                    width: parent.width
                                    height: parent.height * 0.8
                                    style: GCButtonStyle {
                                        theme: "dark"
                                    }

                                    Image {
                                        id: selectedIcon
                                        source: "qrc:/gcompris/src/core/resource/apply.svg"
                                        sourceSize.width: height
                                        sourceSize.height: height
                                        width: height
                                        height: parent.height / 4
                                        anchors.bottom: parent.bottom
                                        anchors.right: parent.right
                                        anchors.margins: 2
                                        visible: dialogActivityConfig.configItem.filteredBackgroundMusic ? dialogActivityConfig.configItem.filteredBackgroundMusic.indexOf(modelData) != -1 : false
                                    }
                                }
                            }
                        }
                    }

                    Column {
                        id: musicInfo
                        spacing: 10 * ApplicationInfo.ratio
                        width: parent.width
                        anchors.top: musicGrid.bottom
                        anchors.leftMargin: 20

                        GCText {
                            //: Current background music playing
                            text: qsTr("Now Playing:")
                            width: dialogBackground.width - 30
                            horizontalAlignment: Text.AlignHCenter
                            color: "black"
                            fontSize: mediumSize
                            wrapMode: Text.WordWrap
                        }
                        GCText {
                            //: Title of the current background music playing
                            text: qsTr("Title: %1").arg(backgroundMusic.metaDataMusic[0])
                            width: dialogBackground.width - 30
                            horizontalAlignment: Text.AlignLeft
                            color: "black"
                            fontSize: smallSize
                            wrapMode: Text.WordWrap
                        }
                        GCText {
                            //: Artist of the current background music playing
                            text: qsTr("Artist: %1").arg(backgroundMusic.metaDataMusic[1])
                            width: dialogBackground.width - 30
                            horizontalAlignment: Text.AlignLeft
                            color: "black"
                            fontSize: smallSize
                            wrapMode: Text.WordWrap
                        }
                        GCText {
                            //: Date of the current background music playing
                            text: qsTr("Date: %1").arg(backgroundMusic.metaDataMusic[2])
                            width: dialogBackground.width - 30
                            horizontalAlignment: Text.AlignLeft
                            color: "black"
                            fontSize: smallSize
                            wrapMode: Text.WordWrap
                        }
                        GCText {
                            //: Copyright of the current background music playing
                            text: qsTr("Copyright: %1").arg(backgroundMusic.metaDataMusic[3])
                            width: dialogBackground.width - 30
                            horizontalAlignment: Text.AlignLeft
                            color: "black"
                            fontSize: smallSize
                            wrapMode: Text.WordWrap
                        }
                    }
                }
                // The scroll buttons
                GCButtonScroll {
                    anchors.right: parent.right
                    anchors.rightMargin: 5 * ApplicationInfo.ratio
                    anchors.bottom: flickableList.bottom
                    anchors.bottomMargin: 30 * ApplicationInfo.ratio
                    width: parent.width / 20
                    height: width * heightRatio
                    onUp: flickableList.flick(0, 1400)
                    onDown: flickableList.flick(0, -1400)
                    upVisible: (flickableList.visibleArea.yPosition <= 0) ? false : true
                    downVisible: ((flickableList.visibleArea.yPosition + flickableList.visibleArea.heightRatio) >= 1) ? false : true
                }
            }
            Item { width: 1; height: 10 }
        }
    }

    GCButtonCancel {
        onClose: {
            parent.close()
        }
    }
}