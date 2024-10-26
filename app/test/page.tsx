'use client';
import { useState, useEffect, memo, createContext, useContext } from 'react'
/* 
function A() {
    console.log('A')
    return <B />
}

const B = memo(() => {
    console.log('B')
    return <C />
})

function C() {
    console.log('C')
    return null
}

function D() {
    console.log('D')
    return null
}

export default function App() {
    const [state, setState] = useState(0)
    useEffect(() => {
        setState(state => state + 1)
    }, [])
    console.log('App')
    return (
        <div>
            <A state={state} />
            <D />
        </div>
    )
} */


const MyContext = createContext(0);

const A = memo(({ children }) => {
    console.log('A')
    return <B></B>
})

function B() {
    const count = useContext(MyContext)
    console.log('B')
    return null
}

function C() {
    console.log('C')
    return null
}

function D() {
    console.log('D')
    return null
}


export default function App() {
    const [state, setState] = useState(0)
    useEffect(() => {
        setState(state => state + 1)
    }, [])
    console.log('App')
    return <MyContext.Provider value={state}>
        <A />
        <C />
    </MyContext.Provider>
}
