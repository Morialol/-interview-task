import React, { useState, useEffect } from "react";
import style from './TaskTable.module.scss';
import TaskInput from "./TaskInput/TaskInput";
import TaskList from "./TaskList/TaskList";
import useInterval from "../../../hooks/UseInterval";

const Currency = ['CNY', 'USD', 'RUB'];

const TaskTable = (props) => {
  const [rate, setRate] = useState({ RuToDo: '-', RuToRm: '-', RmToDo: '-' });
  const [todoList, setTodoList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [willCost, setWillCost] = useState({});
  const [cost, setCost] = useState({});

  const fetchData = async (base, symbols) => {
    let url = `https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`;
    const response = await fetch(url);
    const res = await response.json();
    console.log(res);
    return res;
  }

  // 获取实时汇率
  const getExchangeRate = async () => {
    const obj = { RuToDo: '-', RuToRm: '-', RmToDo: '-' }
    // 美元兑卢币/人民币
    const res1 = await fetchData('USD', 'CNY,RUB');
    if (res1 && res1.rates) {
      obj.RmToDo = res1.rates.CNY;
      obj.RuToDo = res1.rates.RUB;
    }
    // 卢币兑人民币
    const res2 = await fetchData('CNY', 'RUB');
    if (res2 && res2.rates) {
      obj.RuToRm = res2.rates.RUB;
    }
    setRate(obj);
  };

  // 隔一分钟查询一次
  useInterval(() => {
    return getExchangeRate();
  }, 60000);

  // 每个价格保留小数点后六位
  const handleLength = (num) => {
    const numStr = String(num);
    const dot = numStr.indexOf('.');
    if (dot !== -1) {
      const dotCnt = numStr.substring(dot+1);
      if (dotCnt.length > 6) {
        return num.toFixed(6);
      }
    }
    return num;
  }

  // 计算每种币的价格
  const countPrice = async (price, money) => {
    const base = money;
    const symbols = Currency.filter(i => i !== money).join(',');
    const res = await fetchData(base, symbols);
    const prices = {
      USD: '-',
      CNY: '-',
      RUB: '-',
    };
    if (res && res.rates) {
      // prices[money] = parseFloat(price);
      prices[money] = parseFloat(handleLength(price));
      Object.keys(res.rates).forEach(key => {
        // prices[key] = parseFloat(res.rates[key]) * parseFloat(price);
        const t = parseFloat(res.rates[key]) * parseFloat(price);
        prices[key] = parseFloat(handleLength(t));
      })
    }

    return prices;
  };

  // 计算每种币的总额
  const countSum = (list, isFinished) => {
    const costObj = list.reduce((pre, cur) => {
      const { allUSD, allCNY, allRUB } = pre;
      const { prices } = cur;
      const { USD, CNY, RUB } = prices;
      return {
        allUSD: allUSD + parseFloat(USD),
        allCNY: allCNY + parseFloat(CNY),
        allRUB: allRUB + parseFloat(RUB),
      };
    }, { allUSD : 0, allCNY: 0, allRUB: 0 });
    if (isFinished) {
      setCost(costObj);
    } else {
      setWillCost(costObj);
    }
  }

  useEffect(() => {
    countSum(todoList)
  }, [todoList, todoList.length])

  useEffect(() => {
    countSum(completedList, true)
  }, [completedList, completedList.length])

  // 添加到计划列表中
  const addToDoList = async (task) => {
    const { taskName, price, money } = task;
    // 根据币种计算其余的币种的价格
    const prices = await countPrice(price, money);
    const id = new Date().getTime();
    setTodoList([...todoList, { taskName, prices, id }])
  };

  // 计划与已完成的切换
  const toggleList = (item, isFinished) => {
    const { id } = item;
    if(isFinished) {
      setCompletedList(completedList.filter(i => i.id !== id));
      setTodoList([...todoList, item])
    } else {
      setTodoList(todoList.filter(i => i.id !== id));
      setCompletedList([...completedList, item]);
    }
  };

  const footer = (isFinished) => {
    const costObj = isFinished ? cost : willCost;
    const title = isFinished ? '一共花了：' : '将要花费：';
    return {
      costObj,
      title
    };
  }

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        账单计算器
      </div>
      <TaskInput rate={rate} addToDoList={addToDoList} />
      <TaskList
        title="计划："
        list={todoList}
        toggleList={toggleList}
        footer={footer(false)}
      />
      <TaskList
        title="已完成："
        list={completedList}
        toggleList={toggleList}
        isFinished
        footer={footer(true)}
      />
    </div>
  );
};

export default TaskTable;