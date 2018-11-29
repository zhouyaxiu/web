#### 13.Proxy

1.读取属性行为

	var proxy=new Proxy({},{
	
	        get:function(target,property){
	
	            return 35
	
	        }
	
	    })
	
	    console.log(proxy.name) //35
	
	    console.log(proxy.time) //35
	
	    console.log(proxy) //Proxy {}
	
	    let obj=Object.create(proxy);
	
	    console.log(obj.name) //35
	
	    console.log(obj.time) //35

2.多个拦截操作

var handler={

            get:function(target,name){
    
                if(name==='prototype'){
    
                    return Object.prototype;
    
                }
    
                return 'Hello,'+name
    
            },
    
            apply:function(target,thisBinding,args){
    
                return args[0]
    
            },
    
            construct:function(target,args){
    
                return {value:args[1]}
    
            }
    
        };
    
        var fproxy=new Proxy(function(x,y){
    
            return x+y
    
        },handler);
    
        console.log(fproxy(1,2)) //1
    
        console.log(new fproxy(15,23)) //{value: 23}
    
        console.log(fproxy.prototype===Object.prototype) //true
    
        console.log(fproxy.foo) //Hello,foo



下面是 Proxy 支持的拦截操作一览，一共 13 种。

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。

  	var person={

              name:'张三'
    
          };
    
          var proxy=new Proxy(person,{
    
              get:function(target,property){
    
                  if(property in target){
    
                      return target[property]
    
                  }else{
    
                      throw new ReferenceError("Property\""+property+"\"does not exist")
    
                  }
    
              }
    
          })
    
          console.log(proxy.name) //张三
    
          console.log(proxy.age) //Property"age"does not exist



   //get可以继承

  	let proto=new Proxy({},{

              get(target,propertyKey,receiver){
    
                  console.log('GET'+propertyKey);
    
                  return target[propertyKey]
    
              }
    
          })


         

          let obj=Object.create(proto); 
    
          console.log(obj.foo) //GETfoo

- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。

   let validator={

       set:function(obj,prop,value){
    
           if(prop==='age'){
    
               if(!Number.isInteger(value)){
    
                   throw new TypeError('The age is not an integer')
    
               }
    
               if(value>200){
    
                throw new RangeError('The age is not an integer')
    
               }
    
           }
    
           obj[prop]=value
    
       }

   }

   let person=new Proxy({},validator)

   person.age=100

   console.log(person.age)//100

   person.age='oeoeo'

    console.log(person.age) //The age is not an integer

2.set四个参数

let handler={

       set:function(obj,prop,value,receiver){
    
           console.log(obj,prop,value,receiver)
    
           //{}__proto__: Object   "foo"    "bar"    Proxy {}
    
           obj[prop]=receiver
    
       }

   }

   const proxy=new Proxy({},handler)

   proxy.foo='bar'

   proxy.foo===proxy

    console.log(proxy.foo) //Proxy {foo: Proxy}
    
    console.log(proxy.foo===proxy) //true

2.

	const obj={};
	
	    Object.defineProperty(obj,'foo',{
	
	        value:'bar',
	
	        writable:false
	
	    });
	
	    const handler={
	
	        set:function(obj,prop,value,receiver){
	
	            obj[prop]='baz'
	
	        }
	
	    };
	
	    const proxy=new Proxy(obj,handler);
	
	    proxy.foo='baz';
	
	    console.log(proxy.foo) //bar

- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。

  	var handler={

              has(target,key){
    
                  if(key[0]==='_'){
    
                      return false;
    
                  }
    
                  return key in target;
    
              }
    
          };
    
          var target={_prop:'foo',prop:'foo'};
    
          var proxy=new Proxy(target,handler);
    
          console.log('_prop' in proxy) //false



  2.has拦截对for...in不起作用

  	let stu1={name:'张三',score:59};

          let stu2={name:'李四',score:89};
    
          let handler={
    
              has(target,prop){
    
                  if(prop==='score' && target[prop]<60){
    
                      console.log(`${target.name} 不及格`);//张三 不及格
    
                      return false
    
                  }
    
                  return prop in target;
    
              }
    
          }
    
          let oproxy1=new Proxy(stu1,handler);
    
          let oproxy2=new Proxy(stu2,handler);
    
          console.log('score' in oproxy1)//false
    
          console.log('score' in oproxy2)//true
    
          for(let a in oproxy1){
    
              console.log(oproxy1[a])//张三  59
    
          }
    
          for(let a in oproxy2){
    
              console.log(oproxy2[a]) //李四  89
    
          }

- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。

  	var handler={

              deleteProperty(target,key){
    
                  invariant(key,'delete');
    
                  delete target[key];
    
                  return true;
    
              }
    
          };
    
          function invariant(key,action){
    
              if(key[0]==='_'){
    
                  throw new Error(`Invalid attempt to ${action} private ${key}`)
    
              }
    
          }
    
          var target={_prop:'foo'};
    
          var proxy=new Proxy(target,handler);
    
          delete proxy._prop;//报错Invalid attempt to delete private _prop
    
          var target={prop:'foo'};
    
          var proxy=new Proxy(target,handler);
    
          delete proxy.prop;//正确

- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。

  	let target={

              a:1,
    
              b:2,
    
              c:3
    
          }
    
          let handler={
    
              ownKeys(target){
    
                  return ['a']
    
              }
    
          };
    
          let proxy=new Proxy(target,handler);
    
          console.log(Object.keys(proxy)) //["a"]

- 2.拦截第一个字符为下划线的属性名

  let target={

            _bar:'foo',
    
            _prop:'bar',
    
            prop:'baz'
    
        };
    
        let handler={
    
            ownKeys(target){
    
                return Reflect.ownKeys(target).filter(key=>key[0]!=='_')
    
            }
    
        };
    
        let proxy=new Proxy(target,handler);
    
        for(let key of Object.keys(proxy)){
    
            console.log(target[key]) //baz
    
        }

- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。

  	var handler={

              getOwnPropertyDescriptor(target,key){
    
                  if(key[0]==='_'){
    
                      return;
    
                  }
    
                  return Object.getOwnPropertyDescriptor(target,key);
    
              }
    
          };
    
          var target={_foo:'bar',baz:'bar'};
    
          var proxy=new Proxy(target,handler);
    
          console.log(Object.getOwnPropertyDescriptor(proxy,'wat'));//undefined
    
          console.log(Object.getOwnPropertyDescriptor(proxy,'_foo'));//undefined
    
          console.log(Object.getOwnPropertyDescriptor(proxy,'baz'));//{value: "bar", writable: true, enumerable: true, configurable: true}

- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。

  	var handler={

              definProperty(target,key,descriptor){
    
                  return true;
    
              }
    
          };
    
          var target={};
    
          var proxy=new Proxy(target,handler);
    
          proxy.foo  = 'bar';
    
          console.log(proxy.foo  = 'bar') //bar

- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。

  var proxy=new Proxy({},{

            preventExtensions:function(target){
    
                return true;
    
            }
    
        })
    
        console.log(Object.preventExtensions(proxy));
    
        //'preventExtensions' on proxy: trap returned truish but the proxy target is extensible

2.加上 Object.preventExtensions(target);

	 var proxy=new Proxy({},{
	
	        preventExtensions:function(target){
	
	            Object.preventExtensions(target);
	
	            return true;
	
	        }
	
	    })
	
	    console.log(Object.preventExtensions(proxy));
	
	    //Proxy {}

- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。

  - `Object.prototype.__proto__`

  - `Object.prototype.isPrototypeOf()`

  - `Object.getPrototypeOf()`

  - `Reflect.getPrototypeOf()`

  - `instanceof`

    var proto={};

          var p=new Proxy({},{
    
              getPrototypeOf(target){
    
                  return proto
    
              }
    
          })
    
          console.log(Object.getPrototypeOf(p)===proto) //true

- 2

  	var proto={};

          var p=new Proxy({},{
    
              getPrototypeOf(target){
    
                  return proto
    
              }
    
          })
    
          console.log(Object.getPrototypeOf(p)===proto) //true
    
          console.log(Object.prototype.__proto__)//null
    
          console.log(Object.prototype.isPrototypeOf())//false
    
          console.log(Object.getPrototypeOf())//Cannot convert undefined or null to object
    
          console.log(Reflect.getPrototypeOf())

- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。

   	var p=new Proxy({},{

              isExtensible:function(target){
    
                  console.log(target,'00');//{} "00"
    
                  return true;
    
              }
    
          });
    
          Object.isExtensible(p)

- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。

  let handler={

             setPrototypeOf(target,proto){
    
                 throw new Error('Changing the prototype is forbidden')
    
      	//Changing the prototype is forbidden
    
             }
    
         };
    
         var proto={};
    
         var target=function(){};
    
         var proxy=new Proxy(target,handler);
    
         Object.setPrototypeOf(proxy,proto)

- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。

  	

  	var target=function(){return 'I am the target'};

          var handler={
    
              apply:function(){
    
                  return 'I am the proxy'
    
              }
    
          };
    
          var p=new Proxy(target,handler)
    
          p();
    
          console.log(p()) //I am the proxy

- 2.

  	var twice={

              apply(target,ctx,args){
    
                  return Reflect.apply(...arguments)*2
    
              }
    
          };
    
          function sum(left,right){
    
              return left+right;
    
          };
    
          var proxy=new Proxy(sum,twice);
    
          console.log(proxy(1,2)) //6
    
          console.log(proxy.call(null,51,34)) //170
    
          console.log(proxy(null,[7,8]))  //NaNvar

- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

  	// var handler={

          //     constructor(target,args,newTarget){
    
          //         return new target(...args)
    
          //     }
    
          // }
    
          var p=new Proxy(function(){},{
    
              construct:function(target,args){
    
                  console.log('called'+args.join(', '));//called1  called1
    
                  return {value:args[0]*10}
    
              }
    
          });
    
          (new p(1)).value
    
          console.log((new p(1)).value) //10

#### 14.Reflect

```javascript
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```

```javascript
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```

```javascript
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1
```

## 静态方法

`Reflect`对象一共有 13 个静态方法。

- Reflect.apply(target, thisArg, args)

   	const ages=[12,44,56,78,33,55,67,78];

          // 旧写法
    
          const youngest=Math.min.apply(Math,ages);
    
          const oldest=Math.max.apply(Math,ages);
    
          const type=Object.prototype.toString.call(youngest);
    
          // 新写法
    
          const youngest=Reflect.apply(Math.min,Math,ages);
    
          const oldest=Reflect.apply(Math.max,Math,ages);
    
          const type=Reflect.apply(Object.prototype.toString,youngest,[]);
    
          console.log(youngest,oldest,type)//12 78 "[object Number]"

- Reflect.construct(target, args)

          

  	 function Greeting(name){

              this.name=name
    
          }
    
          const instance=new Greeting('张三')
    
          console.log(instance)//Greeting {name: "张三"}
    
          const instance1=Reflect.construct(Greeting,['李四'])
    
          console.log(instance1)//Greeting {name: "李四"}

- Reflect.get(target, name, receiver)

  	var myObject={

              foo:1,
    
              bar:2,
    
              get baz(){
    
                  return this.foo+this.bar
    
              }
    
          }
    
          console.log(Reflect.get(myObject,'foo'))//1
    
          console.log(Reflect.get(myObject,'bar'))//2
    
          console.log(Reflect.get(myObject,'baz'))//3

  2.部署了读取函数

  	var myObject={

              foo:1,
    
              bar:2,
    
              get baz(){
    
                  return this.foo+this.bar
    
              }
    
          }
    
          var myReceiverObject={
    
              foo:4,
    
              bar:6
    
          }
    
          console.log(Reflect.get(myObject,'baz',myReceiverObject))//10

- Reflect.set(target, name, value, receiver)

  	var myObject={

              foo:1,
    
              set baz(value){
    
                  return this.foo=value
    
              }
    
          }
    
          console.log(myObject.foo)//1
    
          console.log(Reflect.set(myObject,'foo',2))//true
    
          console.log(myObject.foo)//2
    
          console.log(Reflect.set(myObject,'foo',4))//true
    
          console.log(myObject.foo)//4

  2.如果name属性设置了赋值函数，则赋值函数的this绑定receiver

        var myObject={
    
              foo:1,
    
              set baz(value){
    
                  return this.foo=value
    
              }
    
          }
    
          var myReceiverObject={
    
              foo:0
    
          }


          

          console.log(Reflect.set(myObject,'baz',2,myReceiverObject))//true
    
          console.log(myObject.foo)//1
    
          console.log(myReceiverObject.foo)//2

  3.如果proxy和reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为

         let p={
    
              a:'a'
    
          };
    
          let handler={
    
              set(target,key,value,receiver){
    
                  console.log('set');
    
                  Reflect.set(target,key,value,receiver)
    
              },
    
              defineProperty(target,key,attribute){
    
                  console.log('defineProperty');
    
                  Reflect.defineProperty(target,key,attribute)
    
              }
    
          };
    
          let obj=new Proxy(p,handler);
    
          obj.a='A';
    
          console.log(obj.a='A')
    
          //set
    
          //defineProperty
    
          //set
    
          //defineProperty
    
          //A

- Reflect.defineProperty(target, name, desc)

- Reflect.deleteProperty(target, name)

       var myObject={
    
              foo:"bar"
    
          }
    
          // 旧写法
    
          delete myObject.foo;
    
          console.log(delete myObject.foo)//true
    
          // 新写法
    
          Reflect.deleteProperty(myObject,'foo')
    
          console.log(Reflect.deleteProperty(myObject,'foo'))//true

- Reflect.has(target, name)

  	var myObject={

              foo:1
    
          }
    
          // 旧写法
    
          'foo' in myObject;
    
          console.log('foo' in myObject)//true
    
          // 新写法
    
          Reflect.has(myObject,'foo')
    
          console.log(Reflect.has(myObject,'foo'))//true

- Reflect.ownKeys(target)

  var myObject={

             foo:1,
      
             bar:2,

  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4

         };


         

         //旧写法
      
         Object.getOwnPropertyNames(myObject)
      
         Object.getOwnPropertySymbols(myObject)
      
         //新写法
      
         Reflect.ownKeys(myObject)
      
         console.log(Reflect.ownKeys(myObject))
      
         //["foo", "bar", Symbol(baz), Symbol(bing)]

- Reflect.isExtensible(target)

        var myObject={};


         

         //旧写法
        
         Object.isExtensible(myObject)
        
         //新写法
        
         Reflect.isExtensible(myObject)
        
         console.log(Reflect.isExtensible(myObject))//true

- Reflect.preventExtensions(target)

  	var myObject={};

         

         //旧写法
    
         Object.preventExtensions(myObject)
    
         //新写法
    
         Reflect.preventExtensions(myObject)
    
         console.log(Reflect.preventExtensions(myObject))//true

- Reflect.getOwnPropertyDescriptor(target, name)

       var myObject={};
    
         Object.defineProperty(myObject,'hidden',{
    
             value:true,
    
             enumerable:false
    
         })
    
         //旧写法
    
         var theDescriptor1=Object.getOwnPropertyDescriptor(myObject,'hidden')
    
         //新写法
    
         var theDescriptor=Reflect.getOwnPropertyDescriptor(myObject,'hidden')
    
         console.log(theDescriptor)
    
         //{value: true, writable: false, enumerable: false, configurable: false}

- Reflect.getPrototypeOf(target)

  	const myObj=new FancyThing();

          // 旧写法
    
          Object.getPrototypeOf(myObj)===FancyThing.prototype;
    
          // 新写法
    
          Reflect.getPrototypeOf(myObj)===FancyThing.prototype;

- Reflect.setPrototypeOf(target, prototype)

       const myObj={};
    
        // 旧写法
    
        Object.setPrototypeOf(myObj,Array.prototype);
    
        // 新写法
    
        Reflect.setPrototypeOf(myObj,Array.prototype);
    
        console.log(Reflect.setPrototypeOf(myObj,Array.prototype))//true



#### 16.Iterator和for..of循环

 var it=idMarker();

       console.log(it.next().value)//0
    
       console.log(it.next().value)//1
    
       console.log(it.next().value)//2
    
       function idMarker(){
    
           var index=0;
    
           return{
    
               next:function(){
    
               return {value:index++,done:false}
    
           }
    
        }
    
       }

原生具备 Iterator 接口的数据结构如下。

- Array

- Map

- Set

- String

- TypedArray

- 函数的 arguments 对象

- NodeList 对象



  Symbol.iterator`的属性上部署遍历器生成方法

  class RangeIterator{

          constructor(start,stop){
    
              this.value=start;
    
              this.stop=stop;
    
          }
    
          [Symbol.iterator](){return this}
    
          next(){
    
              var value=this.value;
    
              if(value<this.stop){
    
                  this.value++;
    
                  return {done:false,value:value}
    
              }
    
              return {done:true,value:undefined}
    
          }
    
      }
    
      function range(start,stop){
    
          return new RangeIterator(start,stop)
    
      }
    
      for(var value of range(0,3)){
    
          console.log(value);//0   1   2
    
      }

2.遍历器实现指针结构

function Obj(value){

          this.value=value;
    
          this.next=null;
    
      }
    
      Obj.prototype[Symbol.iterator]=function(){
    
          var iterator={next:next};
    
          var current=this;
    
          function next(){
    
              if(current){
    
                  var value=current.value;
    
                  current=current.next;
    
                  return {done:false,value:value}
    
              }else{
    
                  return {done:true}
    
              }
    
          }
    
          return iterator
    
      }
    
      var one=new Obj(1);
    
      var two=new Obj(2);
    
      var three=new Obj(3);
    
      one.next=two;
    
      two.next=three;
    
      for(var i of one){
    
          console.log(i)// 1    2    3
    
      }



3.另一个类似数组的对象调用数组的`Symbol.iterator`方法的例子

let iterable={

          0:'a',
    
          1:'b',
    
          2:'c',
    
          length:3,

[Symbol.iterator]: Array.prototypeSymbol.iterator

      }
    
      for(let item of iterable){
    
          console.log(item)// a  b  c
    
      }



4.调用Iterator接口的场合

1.解构赋值

	let set=new Set().add('a').add('b').add('c');
	
	  let [x,y]=set
	
	  console.log(x,y)//a b
	
	  let [first,...rest]=set
	
	  console.log(first,rest)//a ["b", "c"]

2.扩展运算符

	var str='hello';
	
	  [...str]
	
	  console.log(str);//hello
	
	  let arr=['b','c'];
	
	  ['a',...arr,'d'];
	
	  console.log('a',arr,'d') //a ["b","c"] d



3.yield*

 let generator=function*(){

          yield 1;
    
          yield* [2,3,4];
    
          yield 5;
    
      };
    
      var iterator = generator();
    
        iterator.next() // { value: 1, done: false }
    
        iterator.next() // { value: 2, done: false }
    
        iterator.next() // { value: 3, done: false }
    
        iterator.next() // { value: 4, done: false }
    
        iterator.next() // { value: 5, done: false }
    
        iterator.next() // { value: undefined, done: true }
#### 12.Set和Map数据结构

 const s=new Set();

[2,3,4,5,66,3,4,5,7].forEach(x=>s.add(x));

 for(let i of s){

    console.log(i)// 2  3  4  5  66 7

}



const s=new Set([2,3,4,5,66,3,4,5,7]);

let ss=[...s]

console.log(ss)//[2, 3, 4, 5, 66, 7]



let s=new Set()

s.add(1).add(2).add(2)

console.log(s.size)//2

console.log(s.has(1))//true

console.log(s.has(3))//false



//去除数组重复成员

function dedupe(array){

     return Array.from(new Set(array))

}

dedupe([1,2,3,3,4,2])

console.log(dedupe([1,2,3,3,4,2]))//[1, 2, 3, 4]



Set 结构的实例有四个遍历方法，可以用于遍历成员。

- `keys()`：返回键名的遍历器

  let set=new Set(['red','green','blue'])

  for(let item of set.keys()){

       console.log(item) //red green blue

  }

- `values()`：返回键值的遍历器

   let set=new Set(['red','green','blue'])

   for(let item of set.values()){

       console.log(item) //red green blue

  }

  可以省略`values`方法，直接用`for...of`循环遍历 Set

   let set=new Set(['red','green','blue'])

    for(let item of set){

        console.log(item) //red green blue

    }

- `entries()`：返回键值对的遍历器

   let set=new Set(['red','green','blue'])

        for(let item of set.entries()){

            console.log(item) 

            //["red", "red"]["green", "green"] ["blue", "blue"]

        }

- `forEach()`：使用回调函数遍历每个成员

  let set=new Set(['red','green','blue'])

      set.forEach((value,key)=>console.log(key,value))

      //red red

      //green green

      //blue blue

遍历器扩展运算符

let set=new Set(['red','green','blue'])

 let arr=[...set];

console.log(arr)//["red", "green", "blue"]

扩展运算符和 Set 结构相结合，就可以去除数组的重复成员。

let arr=['red','green','blue','red']

let unique=[...new Set(arr)];

console.log(unique)//["red", "green", "blue"]

而且，数组的`map`和`filter`方法也可以间接用于 Set 了

let set=new Set([1,2,3]);

set=new Set([...set].map(x=>x*2))

console.log(set)//Set(3) {2, 4, 6}



let set=new Set([1,2,3,4,5,6,7,8]);

set=new Set([...set].filter(x=>x%2==0))

console.log(set)//Set(4) {2, 4, 6, 8}



并集（Union）、交集（Intersect）和差集

并集

 let a=new Set([1,2,3,8]);

let b=new Set([3,6,10]);

let union=new Set([...a,...b])

console.log(union)//Set(6) {1, 2, 3, 8, 6,10}

交集

let a=new Set([1,2,3,8]);

let b=new Set([3,6,10]);

 let intersect=new Set([...a].filter(x=>b.has(x)))

console.log(intersect)//Set(1) {3}

差集

 let a=new Set([1,2,3,8]);

let b=new Set([3,6,10]);

let difference=new Set([...a].filter(x=>!b.has(x)))

console.log(difference)//Set(3) {1, 2, 8}



如果想在遍历操作中，同步改变原来的 Set 结构

但有两种变通方法。一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用`Array.from`方法。

let set=new Set([1,2,3,8]);

set=new Set([...set].map(x=>x*2))

console.log(set)//Set(4) {2, 4, 6, 16}



let set=new Set([1,2,3,8]);

set=new Set(Array.from(set,x=>x*2))

console.log(set)//Set(4) {2, 4, 6, 16}



##### 2.weakset

WeakSet 的成员只能是对象，而不能是其他类型的值

const a=[[1,2],[3,4]]

const ws=new WeakSet(a)

console.log(ws)//WeakSet {Array(2), Array(2)}

WeakSet 结构有以下三个方法。

- **WeakSet.prototype.add(value)**：向 WeakSet 实例添加一个新成员。

- **WeakSet.prototype.delete(value)**：清除 WeakSet 实例的指定成员。

- **WeakSet.prototype.has(value)**：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

  const ws=new WeakSet()

      const obj={}

      ws.add(window)

      ws.add(obj)

      console.log(ws.has(window))//true

      console.log(ws.has(foo))//foo is not defined

      ws.delete(window)

      console.log(ws.has(window))//false



##### 3.Map

	const m=new Map()

      const o={p:'Hello world'}

      console.log(m.set(o,'content'))//Map(1) {{…} => "content"}

      console.log(m.get(o))//content

      console.log(m.has(o))//true

      m.delete(o)

      console.log(m.has(o))//false



 	const m=new Map([['name','张三'],['title','Author']])

      console.log(m.size)//2

      console.log(m.has('name'))//true

      console.log(m.get('name'))//张三



	const items=[['name','张三'],['title','Author']]

      const m=new Map()

      items.forEach(

          ([key,value])=>m.set(key,value)

      )

      console.log(m.get('name'))//张三

`Set`和`Map`都可以用来生成新的 Map。

 const set=new Set([['name','张三'],['title','Author']])

      const m1=new Map(set)

      console.log(m1.get('name'))//张三

      const m2=new Map([['baz','2434']])

      console.log(m2.get('baz'))//2434

同样的值的两个实例，在 Map 结构中被视为两个键

const map = new Map();

        const k1 = ['a'];

        const k2 = ['a'];

        map

            .set(k1, 111)

            .set(k2, 222);

        map.get(k1) // 111

        map.get(k2) // 222



###### 实例的属性和操作方法

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（`...`）

	const map = new Map([

        	[1, 'one'],

       		[2, 'two'],

        	[3, 'three'],

        ]);

        [...map.keys()]

        // [1, 2, 3]

        [...map.values()]

        // ['one', 'two', 'three']

        [...map.entries()]

        // [[1,'one'], [2, 'two'], [3, 'three']]

        [...map]

        // [[1,'one'], [2, 'two'], [3, 'three']]





