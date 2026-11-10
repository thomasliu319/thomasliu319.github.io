# kafka在mac上的安装与启用

## 1.kafka安装包下载

在[Apache的kafka官网](https://www.apache.org/dyn/closer.cgi?path=/kafka/2.1.0/kafka_2.11-2.1.0.tgz)下载安装包，以下4个包随便选一个下载。
![image-20210902143503431](/Users/thomasliu/Library/Application Support/typora-user-images/image-20210902143503431.png)



## 2.启动zookeeper的服务

进入文件的解压目录，输入

```
bin/zookeeper-server-start.sh config/zookeeper.properties
```

## 3.启动kafka的服务

另起一个窗口,进入解压目录，输入

```
bin/kafka-server-start.sh config/server.properties
```



## 4.配置topic

另起窗口，进入解压目录，输入

```
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic my_test
```



我们也可以通过以下命令查看topic

```
bin/kafka-topics.sh --list --zookeeper localhost:2181
```



到这里topic就创建完成了

## 5.创建生产者

输入以下命令可成功创建生产者

```
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic my_test
```



## 6.创建消费者

另起窗口，输入以下命令：

```
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic my_test --from-beginning
```

这样消费者也创建成功了
我们可以在生产者的窗口中输入一个1，可以发现消费者中也会出现一个1



到这里，单点的kafka环境部署就全部结束了！