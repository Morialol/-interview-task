import React from "react";
import style from './TaskList.module.scss';

const TaskList = (props) => {
  const { title, list, isFinished, toggleList, footer } = props;

  const renderItem = (item) => {
    return (
      <div className={style.listItem} onClick={() => toggleList(item, isFinished)}>
        <div className={style.ItemName}>
          <label>
            <input type="checkbox" readOnly checked={isFinished ? "checked" : false}></input>
          </label>
          <span style={{ textDecoration: isFinished ? 'line-through' : 'none'  }}>{item.taskName}</span>
        </div>
        <div className={style.price}>₽{item.prices.RUB}</div>
        <div className={style.price}>¥{item.prices.CNY}</div>
        <div className={style.price}>${item.prices.USD}</div>
      </div>
    );
  };

  const renderList = (_list) => {
    if (!_list.length) {
      return (
        <div className={style.vacant}>
          <span>-暂无数据-</span>
        </div>
      );
    }
    return (
      <>
      {
        _list.map(item => (
          <React.Fragment key={item.id}>
            {
              renderItem(item)
            }
          </React.Fragment>
        ))
      }
      </>
    );
  };

  const renderFooter = () => {
    const { title, costObj } = footer;
    const { allUSD, allCNY, allRUB } = costObj;
    return (
      <div className={style.listItem}>
        <span className={style.ItemName}>{title}</span>
        <span className={style.price}>₽{allRUB}</span>
        <span className={style.price}>¥{allCNY}</span>
        <span className={style.price}>${allUSD}</span>
      </div>
    );
  }
  
  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <span className={style.title}>{title}</span>
      </div>
      <div className={style.content}>
        {
          renderList(list)
        }
      </div>
      <div className={style.footer}>
        {
          renderFooter()
        }
      </div>
    </div>
  );
};

export default TaskList;
