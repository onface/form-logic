import spare from "sparejs";

let correctValue = function(key, settings) {
	// console.log('correctValue',this,key, settings)

	let self = this
	let s = spare(settings, {})
	let stateValue = self.get(key)
	let value
    let outputChecked
	/**
	 * value origin from
	 * 		stateValue -> s.get(key)
	 * 		defaultValue -> s.value [针对radio/checkbox]
	 *
	 */
	switch(s.type) {
        case 'checkbox':
            let multiValueIndex = stateValue.indexOf(s.value)
            if (multiValueIndex !== -1) {
                outputChecked = true
            }
            else {
                outputChecked = false
            }
            value = s.value
        break
        case 'radio':
            outputChecked = Boolean(s.value === stateValue)
            value = s.value
        break
        default:
            value = stateValue
    }


	/**
	 * value translate to
	 * 		{string|fn|~} s.props
	 */
	let outputValue = {}
    switch(typeof s.props) {
        case 'string':
            outputValue[s.props] = value
        break
        case 'function':
            outputValue = s.props(value)
        break
        default:
            outputValue.value = value
    }

    return {
        value:outputValue,
        checked:outputChecked
    }

}
let correctCheck = function(settings) {
    let self = this
    let s = spare(settings, {})
    let check = {
        'default':false,
        'change':false,
        'blur':false,
        'focus':false
    }
    // console.log('correctCheck input',s.check)
    switch(typeof s.check){
        case 'function':
            check.default = s.check
            check.blur = s.check
        break
        case 'object':
            Object.keys(s.check).forEach(function(skey){
                Object.keys(check).forEach(function(key){
                    if(key.match(skey)){
                        check[key] = s.check[skey]
                    }
                })
            })
        break
        default:
    }
    // console.log('correctCheck output',check)
    // console.log('---------')
    return check
}
export default {
    correctValue: correctValue,
    correctCheck: correctCheck
}
module.exports = {
    correctValue: correctValue,
    correctCheck: correctCheck
}
