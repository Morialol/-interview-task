import React, { useState } from "react";
import style from './TaskInput.module.scss';

const TaskInput = (props) => {
  const { rate, addToDoList } = props;
  const { RuToDo, RuToRm, RmToDo } = rate;

  const [taskName, setTaskName] = useState('');
  const [price, setPrice] = useState('');
  const [money, setMoney] = useState('');

  // 添加任务
  const handleAdd = () => {
    if (!taskName) {
      alert('请输入任务')
      return;
    }
    if (!price) {
      alert('请输入价格')
      return;
    }
    if (!money) {
      alert('请选择货币类型')
      return;
    }
    const taskItem = {
      taskName,
      price,
      money,
    };
    if (addToDoList) {
      addToDoList(taskItem);
      setTaskName('');
      setPrice('');
    }
  }

  const isVaild = (num) => {
    const numStr = String(num);
    const reg = /^\d*\.?\d*$/;
    if (!reg.test(numStr)) {
      return false;
    }
    const dot = numStr.indexOf('.');
    if (dot !== -1) {
      const dotCnt = numStr.substring(dot+1);
      if (dotCnt.length > 6) {
        return false;
      }
    }
    return true;
  }

  const priceChange = (val) => {
    if (isVaild(val))
    setPrice(val)
  }

  return (
    <div className={style.wrapper}>
      <div className={style.inputGroup}>
        <input className={style.taskName} value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="任务" />
        <input className={style.taskPrice} value={price} onChange={e => priceChange(e.target.value)}  placeholder="价格" />
        <select className={style.currency} value={money} onChange={e => setMoney(e.target.value)}>
          <option value="">货币类型</option>
          <option value="RUB">卢布</option>
          <option value="USD">美元</option>
          <option value="CNY">人民币</option>
        </select>
        <button onClick={handleAdd}>添加</button>
      </div>
      <div className={style.exchange}>
        <span style={{ color: '#aaa' }}>（每隔60秒更新）</span>
        <span>{RuToRm} ₽/¥</span>
        <span>{RuToDo} ₽/$</span>
        <span>{RmToDo} ¥/$</span>
      </div>
    </div>
  );
};

export default TaskInput;