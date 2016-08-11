'use strict'
import test from "tape"
import stackParser from "../src"
import * as path from 'path'
const input = path.join(__dirname, 'test.xml')
const output = path.join(__dirname, '/../test_output/test.txt')
const Parser = new stackParser(input, output, {type: 2})

test("stackParser", (t) => {
  t.plan(1)
  t.equal(true, Parser.start()  === true, "return true")
})