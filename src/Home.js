import React, { useEffect, useState } from 'react'

export default function Home() {
    var result = {
        parents: []
        //each option in the data should have their own key in this object and its value should be an array that contains all the sub-options 
    }
    const [finalResult, setFinalResult] = useState()
    const [dropDowns, setDropDowns] = useState([])
    const [parentOption, setParentOption] = useState()
    const [loading, setLoading] = useState(false)

    const selectChangeHandler = (value, type, index) => {
        if (type === 'parent') {
            //if the top parent is changed after selecting below dropdowns
            if (dropDowns.length > 1) {
                setParentOption(value)
                setDropDowns([])
            }
            else {
                setParentOption(value)
            }
        }

        if (finalResult[value].length !== 0) {
            if ((dropDowns.length - index > 1) && type !== 'parent') {
                let tempArray = dropDowns
                tempArray = tempArray.slice(0, index + 1)
                setDropDowns([...tempArray])
            }
            setDropDowns(prev => [...prev, {
                selected: value,
                options: finalResult[value]
            }])
        }
        else {
            alert('endpoint reached')
            if (type !== 'parent') {
                let tempArray = dropDowns
                tempArray = tempArray.slice(0, index + 1)
                setDropDowns([...tempArray])
            }
        }
    }

    useEffect(() => {
        setLoading(true)
        let mainArray = []  //two dimensional array
        fetch(`./data.txt`)
            .then(res => res.text())
            .then(temp => {
                temp.split("\n").forEach((item) => {
                    mainArray = [...mainArray, item.split(' > ')]
                })
                for (let i = 0; i < mainArray.length; i++) {
                    for (let j = 0; j < mainArray[i].length; j++) {
                        if ((j - 1) === -1) {
                            if (!result.parents.includes(mainArray[i][j])) {
                                result.parents.push(mainArray[i][j])
                                result[mainArray[i][j]] = []
                            }
                        }
                        else {
                            let parent = mainArray[i][j - 1]

                            //checking if the key of the parent of the current option already has the current option in its correspoinding array, if not we push the current option in its parent's array
                            if (!result[parent].includes(mainArray[i][j])) {
                                result[parent] = [...result[parent], mainArray[i][j]]
                            }

                            //creating a key of the current option in the result object if it doesnt already exist
                            if (!Object.keys(result).includes(mainArray[i][j])) {
                                result[mainArray[i][j]] = []
                            }
                        }
                    }
                }
                setLoading(false)
                setFinalResult({ ...result })
            })
    }, [])

    return (
        <div className='home-container'>
            <h1>Google Taxonomy</h1>
            <select onChange={(e) => selectChangeHandler(e.target.value, 'parent', 0)} value={parentOption} style={{ margin: '10px 0' }}>
                <option>-Please Select-</option>
                {finalResult?.parents.map((item, index) => {
                    return <option value={item} key={index}>{item}</option>
                })}
            </select>
            {(dropDowns.length > 0) ? dropDowns.map((item, index2) => {
                return <>
                    <select selected={item.selected} onChange={(e) => selectChangeHandler(e.target.value, 'child', index2)} style={{ margin: '10px 0' }}>
                        <option value='default'>-Please Select-</option>
                        {item.options.map((option, index) => {
                            return <option value={option} key={index}>{option}</option>
                        })}
                    </select>
                </>
            }) : null}
            {(loading === true) ? <p>Please Wait..</p> : null}
        </div>
    )
}
