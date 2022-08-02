import './App.css';
import {useEffect} from "react"
import {BehaviorSubject} from "rxjs"
import {skipWhile} from "rxjs/operators"
import {useReactive} from "ahooks"

function App() {

  const subs = [];
  //双向绑定
  const state = useReactive({
    appSubject:new BehaviorSubject({}),
    rappSubject:new BehaviorSubject({}),
    data:"",
  })

  useEffect(()=>{
    const subr = state.rappSubject.pipe(skipWhile(val=>val===null && val!=="")).subscribe(res=>{
      state.data = res.test;
    })
    //方便最终清理订单
    subs.push(subr);

    return ()=>{
      subs.forEach((item)=>{
        item.unsubscribe();
      })
    }
  },[])

  function sendData(){
    state.appSubject.next({
      data:"parent",
      test:"123"
    });
  }

  return (
    <div className="App">
      <SonComponent appSubject = {state.appSubject} rappSubject = {state.rappSubject} />
      <p><button onClick={sendData}>父传子</button></p>
      <p>接收子组件数据：{state.data}</p>
    </div>
  );
}

function SonComponent(props){
  const subs = [];

  const state = useReactive({
    data:""
  })

  useEffect(()=>{
    const sub =  props.appSubject
      .pipe(skipWhile(val=>val===null))
      .subscribe(res=>{
      state.data = res.data;
    })
    subs.push(sub);
    return ()=>{
      subs.forEach((item)=>{
        item.unsubscribe();
      })
    }
  },[])

  function send(){
    props.rappSubject.next({test:"son"});
  }

  return(
    <div>
      <p>-------------start-----------</p>
      <p>我是子组件</p>
      <p>接收的父组件的值：{state.data}</p>
      <button onClick={send}>子传父</button>
      <p>-------------end-------------</p>
    </div>
  )
}

export default App;
