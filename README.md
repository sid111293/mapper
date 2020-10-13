# Facebook Post Automater

## Description
    * This module will transform one object to another type of object. This can transform most complex structures.

## Installation
    * npm i mapper

## Use
    * const mapper = require("mapper");

    * const target = mapper(sourceObject, targetToSourceMap)

    * Example: 
        const sourceObject = {
            a:1, 
            b: {
                c: 1, 
                d: [{e: 2}]
            }
        } 

        const targetToSourceMap = {
            "_a": "a",
            "_b._c": "b.c",
            "_b._d[_e]": "b.d[e]"
        }

        const target = mapper(sourceObject, targetToSourceMap);

        output => {
            _a: 1,
            _b: {
                _c: 1,
                _d: [{_e: 2}]
            }
        }
## Parameters
    * sourceObject: It is the original object.
    * targetToSourceMap: This object is map between target to source, Which tell mapper the relation between target keys and source keys. In targetToSourceMap, Symbol dot(.) represent "inside object" and [] reprent "inside array".