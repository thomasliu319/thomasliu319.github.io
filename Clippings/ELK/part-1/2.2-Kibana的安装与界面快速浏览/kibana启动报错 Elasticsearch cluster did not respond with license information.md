# kibana启动报错 Elasticsearch cluster did not respond with license information

1、现象

./bin/elasticsearch

./bin/kibana 在这一步的时候报错

状态刚开始变红那一段会提示

![image-20210828101653372](/Users/thomasliu/Library/Application Support/typora-user-images/image-20210828101653372.png)

最终会因为请求超时（request timeout 30000）而终止

2、原因

启动的 elasticsearch 节点不是主节点，没有 license 信息

3、查找过程

首先确定 elasticsearch 和 kibana 的版本都是7.1，所以不是版本不一致的问题

执行

```
curl -uelastic -XGET "http://localhost:9200/_xpack?pretty"
```

结果如下：

![image-20210828101858940](/Users/thomasliu/Library/Application Support/typora-user-images/image-20210828101858940.png)

这里看到 license 是 null，最可能的原因就是要连接的这个 elasticsearch 节点不能和master节点建立连接

可是我只启动了一个 elasticsearch 节点，按道理它就是 master 节点啊

再执行

```
curl -uelastic -XGET 'http://localhost:9200/_cluster/health?pretty'
```

结果如下：

![image-20210828102126197](/Users/thomasliu/Library/Application Support/typora-user-images/image-20210828102126197.png)



还可以看一下 elasticsearch.log

google 了一下，看到一个关键处

```
If you don't need the data on this cluster any more, then you can just delete everything (the data/directory) start over, and it will regenerate the license.
```

突然想到在用 kibana 之前，按照官网文档捣鼓一下 elasticsearch，开启过三个 elasticsearch 节点，可能就是那个时候造成某些节点不是主节点了，所以我把目录下 data、data2、data3、logs、log2、log3 都删除了，重新启动 elasticsearch，就会重新生成 data、logs 文件夹，license 也会重新生成，可以再次执行

```
curl -uelastic -XGET "http://localhost:9200/_xpack?pretty"
```

会看到如下结果：

![image-20210828102508724](/Users/thomasliu/Library/Application Support/typora-user-images/image-20210828102508724.png)

看到有 license 后，重新启动 kibana，就会看到启动成功啦

