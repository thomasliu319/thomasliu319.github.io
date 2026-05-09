# 使用logstash 运行配置文件，出现you must change the "path.data" setting

Logstash could not be started because there is already another instance using the configured data directory.  If you wish to run multiple instances, you must change the "path.data" setting
将原先的命令：

```
sudo bin/logstash -f /Users/thomasliu/Blog/ELK/part-1/2.4-Logstash安装与导入数据/movielens/logstash.conf
```

改为：

```
sudo bin/logstash -f /Users/thomasliu/Blog/ELK/part-1/2.4-Logstash安装与导入数据/movielens/logstash.conf --path.data=/Users/thomasliu/
```

其中，--path.data是指存放数据的路径