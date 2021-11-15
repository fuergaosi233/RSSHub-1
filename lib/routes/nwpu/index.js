import got from '~/utils/got.js';

export default async (ctx) => {
    const {
        column
    } = ctx.params;

    const response = await got({
        method: 'get',
        url: `https://service-ajsh9ixx-1304010583.bj.apigw.tencentcs.com/release/nwpu-ecampus-news?column=${column}`,
    });
    const {
        data
    } = response.data.body.data.data;
    const {
        name
    } = data.extras.channel;

    ctx.state.data = {
        title: `西北工业大学 - ${name}`,
        link: 'https://ecampus.nwpu.edu.cn/portal-web',
        description: `西北工业大学翱翔门户 - ${name}`,
        item: data.aaData.map((item) => ({
            title: item.title,
            description: item.contentDetail.body,
            pubDate: new Date(item.releaseDate),
            link: `https://ecampus.nwpu.edu.cn/portal-web/html/index.html?id=${item.id}#/news-detail`,
            category: item.releaseOrgName,
            author: item.contentDetail.textUser,
        })),
    };
};