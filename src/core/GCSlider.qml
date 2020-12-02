/* GCompris - GCSlider.qml
 *
 * SPDX-FileCopyrightText: 2018 Alexis Breton <alexis95150@gmail.com>
 *
 * Authors:
 *   Alexis Breton <alexis95150@gmail.com>
 *
 *   SPDX-License-Identifier: GPL-3.0-or-later
 */
import QtQuick 2.6
import QtQuick.Controls 2.2

import GCompris 1.0

/**
  * A Slider component with GCompris' style.
  * @ingroup components
  *
  * Provides the "scrollEnabled" property to replace "wheelEnabled"
  * that is only available with QtQuick.Controls > 1.6. If using
  * QtQuick.Controls >= 1.6, please use the built-in "wheelEnabled" property
  *
  * @inherit QtQuick.Controls.Slider
  */
Slider {
    id: control
    /**
      * type:bool
      * Set to false to disable changing the value by scrolling the mouse.
      * Default is true.
      *
      * If false, the mouse scrolling is disabled while hovering the slider.
      *
      * Deprecated if using QtQuick.Controls >= 1.6
      */
    property bool scrollEnabled : true

    stepSize: 1.0
    //tickmarksEnabled: true

    // Removes scrolling when hovering sliders if scrollEnabled = false
    MouseArea {
        anchors.fill: parent
        enabled: !scrollEnabled
        onWheel: {}
        onPressed: mouse.accepted = false
        onReleased: mouse.accepted = false
    }

    background: Item {
        anchors.verticalCenter: parent.verticalCenter
        implicitWidth: 250 * ApplicationInfo.ratio
        implicitHeight: 8 * ApplicationInfo.ratio
        Rectangle {
            radius: height/2
            anchors.fill: parent
            border.width: 1
            border.color: "#888"
            gradient: Gradient {
                GradientStop { color: "#bbb" ; position: 0 }
                GradientStop { color: "#ccc" ; position: 0.6 }
                GradientStop { color: "#ccc" ; position: 1 }
            }
        }
        Item {
            width: control.visualPosition * parent.width
            height: parent.height
            Rectangle {
                anchors.fill: parent
                border.color: Qt.darker("#f8d600", 1.2)
                radius: height/2
                gradient: Gradient {
                    GradientStop {color: "#ffe85c"; position: 0}
                    GradientStop {color: "#f8d600"; position: 1.4}
                }
            }
        }
    }

}
