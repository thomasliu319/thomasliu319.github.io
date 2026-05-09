# DBeaver笔记-快捷键篇

公司使用的是MYSQL数据库，可以使用navicat或者DBeaver进行连接该数据库。个人更喜欢用DBeaver，因为其界面更加美观，操作也相对简单。对于习惯了eclipse的开发者来说，DBeaver绝对是个不错的选择。

```
DBeaver 是一个通用的数据库管理工具和 SQL 客户端，支持 MySQL, PostgreSQL, Oracle, DB2, MSSQL, Sybase, Mimer, HSQLDB, Derby, 以及其他兼容 JDBC 的数据库。

DBeaver 提供一个图形界面用来查看数据库结构、执行 SQL 查询和脚本，浏览和导出数据，处理 BLOB/CLOB 数据，修改数据库结构等等。

```

## mac常用按键说明：

```
⌘ == Command
⇧ == Shift
⇪ == Caps Lock
⌥ == Option
⌃ == Control
↩ == Return/Enter
⌫ == Delete
⌦ == 向前删除键（Fn+Delete）
↑ == 上箭头
↓ == 下箭头
← == 左箭头
→ == 右箭头
⇞ == Page Up（Fn+↑）
⇟ == Page Down（Fn+↓）
Home == Fn + ←
End == Fn + →
⇥ == 右制表符（Tab键）
⇤ == 左制表符（Shift+Tab）
⎋ == Escape (Esc)
⏏ == 电源开关键
```



## hot key

```
⌃ + ]    SQL编辑器 
⌃ + ↩    执行sql
⌃ + ⇧ + ↑ 向上复制一行
⌃ + ⇧ + ↓ 向下复制一行
⌃ + ⌥ + F 对sql语句进行格式化，对于很长的sql语句很有用
⌘ + d 删除当前行
⌥ + ↑ 向上选定一条sql语句
⌥ + ↓ 向下选定一条sql语句
⌃ + / 行注释
⌃ + ⇧+ / 块注释
⌃ + f 查找、替换
⌃ + space sql提示(如果写了from table后也会自动提示field)
⌃ + ⇧ + E  执行计划
⌃ + ⇧ + U  将选定的sql转换成大写字母
⌃ + ⇧ + L  将选定的sql转换成小写字母
```



## 小技巧

- 有一些快捷键在使用时，只需要将光标移动到某一条sql语句上就行，不需要选定整条完整的语句。
- 有一些快捷键使用时是默认对当前一整个 `Script` 页面生效，可以通过光标来选定只想生效的范围。