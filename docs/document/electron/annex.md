# 附录

文档中用到的结构体定义

```
Result
{
  code, //{Number} 0表示成功,其它值为失败
  description //{String} code为非0值时，表示失败原因
}
ContactListResult
{
    code:result.errorCode, //{Number} 0表示成功,其它值为失败
    description:result.description, //{String} code为非0值时有效，表示失败原因
    data //{StringArray} 用户ID数组，code为0时有效，["ID1","ID2"]
}
GroupResult
{
    code:result.errorCode, //{Number} 0表示成功,其它值为失败
    description:result.description, //{String} code为非0值时有效，表示失败原因
    data //{StringArray} EMGroup对象，code为0时有效
}
GroupListResult
{
    code:result.errorCode, //{Number} 0表示成功,其它值为失败
    description:result.description, //{String} code为非0值时有效，表示失败原因
    data //{Array} EMGroup对象数组，code为0时有效
}
SharedFileResult
{
    code:result.errorCode, //{Number} 0表示成功,其它值为失败
    description:result.description, //{String} code为非0值时有效，表示失败原因
    data //{Object} EMMucSharedFile，code为0时有效
}
SharedFileListResult
{
    code:result.errorCode, //{Number} 0表示成功,其它值为失败
    description:result.description, //{String} code为非0值时有效，表示失败原因
    data //{Array} EMMucSharedFile对象数组，code为0时有效
}
AnnouncementResult
{
    code:result.errorCode, //{Number} 0表示成功,其它值为失败
    description:result.description, //{String} code为非0值时有效，表示失败原因
    data //{String} 群组公告内容，code为0时有效
}
MessageListResult
{
    code:result.errorCode, //{Number} 0表示成功,其它值为失败
    description:result.description, //{String} code为非0值时有效，表示失败原因
    data //{Array} EMMessage对象数组，code为0时有效
}
```