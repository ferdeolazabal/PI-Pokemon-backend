//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn, Type, Pokemon } = require('./src/db.js');  
const { infoTypeApy } = require('./src/Controllers/type'); 


conn.sync({ force: false }).then(() => {
  server.listen(3001, async () => {
    
    try{
      
      const typeList= await infoTypeApy();
      const foundTypesDB = await Type.findAll({
        attributes: ['name']
      });
      
      if(foundTypesDB.length === 0){
        await Type.bulkCreate(typeList)
      }
      
    } catch(error) {
      console.error(error);
    }
      console.log('server listening at 3001'); // eslint-disable-line no-console
      console.log('DB connected, Pokemons && types preloaded!');
  });
}); 