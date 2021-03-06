/* GCompris - DragPoint.qml
 *
 * SPDX-FileCopyrightText: 2016 Pulkit Gupta <pulkitnsit@gmail.com>
 *
 * Authors:
 *   Pulkit Gupta <pulkitnsit@gmail.com>
 *
 *   SPDX-License-Identifier: GPL-3.0-or-later
 */
import QtQuick 2.6

import "../../core"
import "nine_men_morris.js" as Activity

import GCompris 1.0

Rectangle {
    id: dragPoint
    width: parent.width / 26
    height: width
    radius: width / 2
    opacity: 1.0
    border.color: "#803300"
    border.width: state == "EMPTY" ? 0 : width/6
    state: "AVAILABLE"

    property int index
    property bool firstPhase
    property bool pieceBeingMoved
    property int pieceIndex
    property QtObject leftPoint
    property QtObject rightPoint
    property QtObject upperPoint
    property QtObject lowerPoint

    states: [
        State {
            name: "AVAILABLE" // Green color
            PropertyChanges {
                target: dragPoint
                color: "#00ff00"
            }
        },
        State {
            name: "UNAVAILABLE"
            PropertyChanges {
                target: dragPoint
                color: "#ff0000"
            }
        },
        State {
            name: "EMPTY" // Brown color
            PropertyChanges {
                target: dragPoint
                color: "#803300"
            }
        },
        State {
            name: "1"
            PropertyChanges {
                target: dragPoint
                color: "#ff0000"
            }
        },
        State {
            name: "2"
            PropertyChanges {
                target: dragPoint
                color: "#ff0000"
            }
        }
    ]

    MouseArea {
        id: area
        enabled: parent.state == "AVAILABLE" && !pieceBeingMoved
        anchors.centerIn: parent
        width: 2.5 * parent.width
        height: 2.5 * parent.height
        onClicked: {
            if (firstPhase)
                Activity.handleCreate(index)
            else
                Activity.movePiece(index)
        }
    }
}
