/* GCompris - ActivityInfo.qml
 *
 * Copyright (C) 2015 Thib ROMAIN <thibrom@gmail.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see <https://www.gnu.org/licenses/>.
 */
import GCompris 1.0

ActivityInfo {
    name: "enumerate/Enumerate.qml"
    difficulty: 2
    icon: "enumerate/enumerate.svg"
    author: "Thib ROMAIN &lt;thibrom@gmail.com&gt;"
    //: Activity title
    title: qsTr("Count the items")
    //: Help title
    description: qsTr("Place the items in the best way to count them.")
//  intro: "Count the elements by organising them then type the answer on your keyboard."
    //: Help goal
    goal: qsTr("Numeration training.")
    //: Help prerequisite
    prerequisite: qsTr("Basic enumeration.")
    //: Help manual
    manual: qsTr("First, properly organize the items so that you can count them. Then, click on an item of the answers list in the top left area and enter the corresponding answer with the keyboard.") + ("<br><br>") +
          qsTr("<b>Keyboard controls:</b>") + ("<ul><li>") +
          qsTr("Up arrow: select next item") + ("</li><li>") +
          qsTr("Down arrow: select previous item") + ("</li><li>") +
          qsTr("Digits: enter your answer for the selected item") + ("</li><li>") +
          qsTr("Enter: validate your answer (if the 'Validate answers' option is set to 'OK button')") + ("</li></ul>")
    credit: ""
  section: "math numeration"
  createdInVersion: 0
  levels: "1,2,3,4"
}
