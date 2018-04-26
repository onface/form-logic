# form-logic(sync) && form-test(verify)  API


## question
- [v]动态表单怎么校验 // => removeItem() resetAllItem() |  clear() clear(key) clear(keyArray)
- 多表单切换校验问题 => 多个FormLogic对应 XXX!!! => 合并成一个FormLogic

- 校验引入react-composition

- 一个name多个规则,多个msg怎么设计 => 使用时组合
- item.check 优于 item.rule
- every? 三者必填其一? equal?
- defaultValue是否有必要,sync to state? state>defaultValue

- [v]校验多项顺序:并发式(queue:false)|队列式(默认queue:true),
- [v]校验多项结束时机: 一个错就结束(every:false)|全部校验完算结束(默认every:true)

- 校验一个项多个规则的顺序与时机

- [v]禁用Item disabled
- [v]settings ({options:fn|obj})

- [v]check(keyArray, [options,] fn)  check(key, [options,] fn)
- [v]set get json-modif get('user.name')
- [v]safe-extends
- state {Number} -> onSync -> {String}
- 多项校验并发,一个错即结束校验, 重新并发校验时,上次的并发校验是否都中止或结束? queue:false, every:false 阻止其他正在校验函数

-
	self.form = new FormLogic({
        app: self,
        getValue: function () { return self.state.form },
        onSync: function (key, value) {
            let state = self.state
            state.form[key] = value
            self.setState({
                form: state.form
            })
        },
    	// 重置规则(只是制定规则,需要item时调用)
        rule:{
        	'email':/\@/,
        	'user':{
        		name:'用户名',
        		regexp: /abc/,
	            be: true,
	            some: '123',
	            msg: '{{self.name}}必须存在abc {{self.some}}'
        	},
        	'password':{
        		name:'密码',
        		minLength: 5,
        		maxLength: 10,
	            msg: '{{self.name}}必须大于或等于5位'
        	},
        	'password2':{
        		name:'密码',
        		minLengthByte: 5,
        		maxLengthByte: 10,
        		minLengthByteChinese:10,
        		maxLengthByteChinese:20,
        		msg: '{{self.name}}最少{{self.minLengthByte}}位英文，{{self.minLengthByteChinese}}位中文'
        	}
        	'repeat_pssaaword':{
        		equal:self.state.form.password, // self.get('password'),
        		msg:'两次密码不一致'
        	}
        	'price':{
        		name:'价格',
        		max: 5,
        		min: 2,
	            msg: '{{self.name}}最小{{self.min}}最大{{self.max}}'
        	},
        	'lists':{
        		// format:'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD' | 'HH:mm:ss'
        		// 基础类型
        		type: time | date | object | array | number | float | tel | email | url | identity
        		type:r.array({
        			name:r.string,
        			tel:r,number
        		}),
        		type:(value) => {
					if (/1/.test(value)){
	                    // fail
	                    return "{{self.name}} 错误消息"
	                }
	                else {
	                    // done
	                    return
	                }
        		}
        	},
        	'required1':{
        		required:required2 || required3 ? false : true ,
        		msg:'required1 required2 required3 三项必填一个'
        	}
        	'required2':{
        		required:required1 || required3 ? false : true ,
        		msg:'required1 required2 required3 三项必填一个'
        	}
        	'required3':{
        		required:required1 || required2 ? false : true ,
        		msg:'required1 required2 required3 三项必填一个'
        	}
        }
    })

-
	item(key, value)
	item(key, {
	    props: 'count',
	    change: 'onMount'
	})
	item(key, {
		props: fn,
		sync: fn
	})
	item(key, {
		value:'value'
		check:{
			default:function(check){
				check.rule('email') ? check.fail(errMsgStr) : check.pass()
			},
			change:function(check){
				check.async(()=>{
					// mock ajax
	                setTimeout(function () {
	                    check.fail('异步错误消息')
	                }, 200)
				})
			},
			blur:function(check){
				check.rule(['email','required']) ? check.fail(errMsgStr) : check.pass()
			},
			focus:fn,
		}
	})
	item(key, {
		rule:'name'
	})
	item(key, {
		every:true,// 每个都校验,
		rule:['required','password','password2'] // 校验先后顺序
	})
	item(key, {
		rule:['required','number']
	})
    item('checkboxDemoInput', { value: 'tim' })
    item('checkboxDemoInput', { value: 'nimo' })
    item('checkboxDemoInput', { value: 'nico' })

-
	set(key, value)
	set({
		key: value,
		...
	})

-
	getValue()

-
	get(key)

-
    // 多表单切换校验用
    checkSome(keyArray, function (fail, errors) {} )

-
	error('key',function(msg){
		return <i>{msg}</i>
	})

-
	let FL = new FormLogic(settings)

	FL.check(key, function(value){
		return new Promise(function(resolve, reject){
			if(){
				resolve(nextKey)
			}else{
				reject('errMsg')
			}
		})
	})

	FL.check(
		keyArray,
		{options},
		function(fail, errors){},
	)
	Fl.check(
		key,
		{
			queue:false, // false: 全部校验并发执行 | 默认true: 全部交验依次队列执行
			every:false // 默认true: 全部项全部校验完,执行回调 | false: 有一个校验失败,就结束校验执行回调
		},
		function(fail, errors){},
	)
	FL.checkAll(function(fail, errors){})

	{...FL.item(key, {
		check: function(value){
			return new Promise(function(reject, resolve){
				if(){
					reject()
				}else{
					resolve()
				}
			})
		}
	})}

	{...FL.item(key, {
		check: (value) => { return xxx ? true : 'errMsg' }
	})}
	{...FL.item(key, {
		check: {
			'blur|default':['required','email'],
			'blur|default': {
				regexp:/com&/,
				be:false
			},
			'change': (value) => { return xxx ? true : 'errMsg' }
		}
	})}
