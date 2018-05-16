let getSyncValue = function(key, value) {
	// console.log('getSyncValue',this,value)
    let self = this
	let stateValue = self.get(key)
	let syncValue = value

    if (typeof value.target !== 'undefined' && typeof value.target.getAttribute === 'function') {
        switch (value.target.getAttribute('type')) {
            case 'checkbox':
                if (value.target.checked) {
                    syncValue = stateValue.concat([value.target.value])
                }
                else {
                    syncValue = stateValue.filter( (item) => {
                        return item !== value.target.value
                    })
                }
            break
            default:
                syncValue = value.target.value
        }
    }


	return syncValue
}

export default getSyncValue