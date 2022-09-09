<script>
    export default {
        
    }
</script>

<template>
    <table>
        <tr>
            <th>字段</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td><code>nickname</code></td>
            <td>String</td>
            <td>用户昵称。长度在 64 字符内。</td>
        </tr>
        <tr>
            <td><code>avatarUrl</code></td>
            <td>String</td>
            <td>用户头像 URL 地址。长度在 256 字符内。</td>
        </tr>
        <tr>
            <td><code>phone</code></td>
            <td>String</td>
            <td>用户联系方式。长度在 32 字符内。</td>
        </tr>
        <tr>
            <td><code>mail</code></td>
            <td>String</td>
            <td>用户邮箱。长度在 64 字符内。</td>
        </tr>
        <tr>
            <td><code>gender</code></td>
            <td>Number</td>
            <td>用户性别。<br/> - <code>1</code>：男；<br/> - <code>2</code>：女；<br/> - （默认）<code>0</code>：未知；<br/> - 设置为其他值无效。</td>
        </tr>
        <tr>
            <td><code>sign</code></td>
            <td>String</td>
            <td>用户签名。长度在 256 字符内。</td>
        </tr>
        <tr>
            <td><code>birth</code></td>
            <td>String</td>
            <td>用户生日。长度在 64 字符内。</td>
        </tr>
        <tr>
            <td><code>userId</code></td>
            <td>String</td>
            <td>用户 ID。</td>
        </tr>
        <tr>
            <td><code>ext</code></td>
            <td>String</td>
            <td>扩展字段。</td>
        </tr>
    </table>
</template>