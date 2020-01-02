/* GCompris - Data.qml
 *
 * Copyright (C) 2019 Shubham Mishra <email.shivam828787@gmail.com>
 *
 * Authors:
 *   Shubham Mishra <email.shivam828787@gmail.com>
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
 *   along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
import "../../../../core"

Dataset {
    objective: qsTr("Select a number on dice up to 9")
    difficulty: 6
    data: [
      {
         "level" : "1",
         "objective" : qsTr("Select the number 9"),
         "words" : [
            "9",
            "9",
            "9",
            "9"
        ]
      },
      {
         "level" : "2",
         "objective" : qsTr("Select the number on dice up to 5"),
         "words" : [
            "1",
            "2",
            "3",
            "4",
            "5"
         ]
      },
      {
         "level" : "3",
         "objective" : qsTr("Select the number on dice up to 6"),
         "words" : [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6"
         ]
      },
      {
         "level" : "4",
         "objective" : qsTr("Select the number on dice up to 7"),
         "words" : [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7"
         ]
      },
      {
         "level" : "5",
         "objective" : qsTr("Select the number on dice up to 8"),
         "words" : [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8"
         ]
      },
      {
         "level" : "6",
         "objective" : qsTr("Select the number on dice up to 9"),
         "words" : [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9"
         ]
      }
   ]
}