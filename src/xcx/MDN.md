#### Object

##### Object`构造函数的属性

- `Object.length`

  值为1。

  [`Object.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)

可以为所有 Object 类型的对象添加属性



[`Object.prototype.hasOwnProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

返回一个布尔值 ，表示某个对象是否含有指定的属性，而且此属性非原型链继承的。

[`Object.prototype.isPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)

返回一个布尔值，表示指定的对象是否在本对象的原型链中。

[`Object.prototype.propertyIsEnumerable()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)

判断指定属性是否可枚举，内部属性设置参见 [ECMAScript [[Enumerable\]] attribute](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Properties) 。

[`Object.prototype.toLocaleString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString)

直接调用 [`toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)方法。

[`Object.prototype.toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

返回对象的字符串表示。

[`Object.prototype.valueOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

返回指定对象的原始值。



##### `Object`构造函数的方法

[`Object.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

通过复制一个或多个对象来创建一个新的对象。

[`Object.create()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

使用指定的原型对象和属性创建一个新对象。

[`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

给对象添加一个属性并指定该属性的配置。

[`Object.defineProperties()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

给对象添加多个属性并分别指定它们的配置。

[`Object.entries()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

返回给定对象自身可枚举属性的`[key, value]`数组。

[`Object.freeze()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

冻结对象：其他代码不能删除或更改任何属性。

[`Object.getOwnPropertyDescriptor()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

返回对象指定的属性配置。

[`Object.getOwnPropertyNames()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)

返回一个数组，它包含了指定对象所有的可枚举或不可枚举的属性名。

[`Object.getOwnPropertySymbols()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)

返回一个数组，它包含了指定对象自身所有的符号属性。

[`Object.getPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)

返回指定对象的原型对象。

[`Object.is()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

比较两个值是否相同。所有 NaN 值都相等（这与==和===不同）。

[`Object.isExtensible()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)

判断对象是否可扩展。

[`Object.isFrozen()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)

判断对象是否已经冻结。

[`Object.isSealed()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)

判断对象是否已经密封。

[`Object.keys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

返回一个包含所有给定对象**自身**可枚举属性名称的数组。

[`Object.preventExtensions()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)

防止对象的任何扩展。

[`Object.seal()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)

防止其他代码删除对象的属性。

[`Object.setPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)

设置对象的原型（即内部`[[Prototype]]`属性）。

[`Object.values()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values)

返回给定对象自身可枚举值的数组。

##### `Object` 实例和`Object` 原型对象

JavaScript中的所有对象都来自`Object`；所有对象从[`Object.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)继承方法和属性，尽管它们可能被覆盖。例如，其他构造函数的原型将覆盖`constructor`属性并提供自己的`toString()`方法。`Object`原型对象的更改将传播到所有对象，除非受到这些更改的属性和方法将沿原型链进一步覆盖。

###### 属性1.Object.prototype



| `Object.prototype` 属性的属性特性： |       |
| ----------------------------------- | ----- |
| writable                            | true  |
| enumerable                          | false |
| configurable                        | true  |

	var Person=function(name){

            this.name=name;

            this.canTalk=true

        }

        Person.prototype.greet=function(){

            if(this.canTalk){

                console.log('Hi,I am '+this.name)

            }else{

                console.log('Sorry,I cannot talk '+this.name)

            }

        }

        var Employee=function(name,title){

            Person.call(this,name);

            this.title=title

        }

        Employee.prototype=Object.create(Person.prototype)

       

        var bob=new Employee('Bob','Builder')

        bob.greet() //Hi,I am Bob

        Employee.prototype.greet=function(){

            if(this.canTalk){

                console.log('Hi,I am '+this.name+' the '+this.title)

            }else{

                console.log('Sorry,I cannot talk '+this.name+' the '+this.title)

            }

        }

        var bob=new Employee('Bob','Builder')

        bob.greet() //Hi,I am Bob the Builder

        

        var Mime=function(name){

            Person.call(this,name);

            this.canTalk=false

        }

        Mime.prototype=Object.create(Person.prototype)

        var mike=new Mime('Mike','CSS')

        mike.greet() //Sorry,I cannot talk Mike

###### 属性2.[`Object.prototype.constructor`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)

特定的函数，用于创建一个对象的原型。

var o={};

o.constructor===Object  //true



 var a=[];

a.constructor===Array //true



1.打印一个对象的构造函数

	function Tree(name){

            this.name=name

        }

        var theTree=new Tree('Redwood');

        console.log(theTree.constructor)

    //    ƒ Tree(name){

    //         this.name=name

    //     }

2.改变对象的constructor

        function Type(){

            

        }

        var types=[

            [],

            true,

            new Date

        ]

        for(var i=0;i<types.length;i++){

            types[i].constructor=Type;

            types[i]=[types[i].constructor,types[i] instanceof Type,types[i].toString()]

        }

        console.log(types)

         //[[ƒ Type(),false,""],[ ƒ, false, "true"],[ƒ, false, "Thu Nov 29 2018 11:38:28 GMT+0800 (中国标准时间)"]]

3,改变函数的constructor



方法

[`Object.prototype.hasOwnProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

返回一个布尔值 ，表示某个对象是否含有指定的属性，而且此属性非原型链继承的。

[`Object.prototype.isPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isPrototypeOf)

返回一个布尔值，表示指定的对象是否在本对象的原型链中。

[`Object.prototype.propertyIsEnumerable()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)

判断指定属性是否可枚举，内部属性设置参见 [ECMAScript [[Enumerable\]] attribute](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#Properties) 。

[`Object.prototype.toLocaleString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString)

直接调用 [`toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)方法。

[`Object.prototype.toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

返回对象的字符串表示。

[`Object.prototype.valueOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

返回指定对象的原始值。

