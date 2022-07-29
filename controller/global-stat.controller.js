const { GlobalStat } = require('../database');
const { wrapWithErrorHandler } = require('../util');
// const { wrapWithErrorHandler } = require('../util');

//테이블의 모든 행들을 검색한 뒤 데이터를 반환한다.
async function getAll(req, res) {
  
  const result = await GlobalStat.findAll();
  res.status(200).json({ result });
}

//들어온 데이터를 이용해 DB 테이블에 행을 추가한다.
async function insertOrUpdate(req, res) {

  try{
    const { cc, date } = req.body;
    //들어온 데이터에 국가, 날짜 내용이 없다면 error를 출력한다.
    if (!cc || !date) {
      res.status(400).json({ error: 'cc and date are required' });
      return;
    }
    const count = await GlobalStat.count({ where: { cc, date } });

    // 들어온 국가값과 날짜값이 일치하는 테이블의 행이 없으면 새 행을 추가한다.
    if (count === 0) {
      await GlobalStat.create(req.body);
    
    // 들어온 국가값과 날짜값이 일치하는 테이블의 행이 존재하면 기존에 존재하는 테이블 행을 업데이트한다.
    } else {
      await GlobalStat.update(req.body, { where: { cc, date } });
    }
    res.status(200).json({ result: 'success' });
  }catch(e) {
    res.status(500).json({error: e.toString()});
  }
}

//들어온 데이터를 이용해 DB 테이블의 행을 삭제한다.
async function remove(req, res) {
  
  //들어온 데이터에 국가, 날짜 내용이 없다면 error를 출력한다.
  const { cc, date } = req.body;
  if (!cc || !date) {
    res.status(400).json({ error: 'cc and date are required' });
    return;
  }

  //들어온 국가값과 날짜값이 일치하는 테이블의 행을 삭제한다.
  await GlobalStat.destroy({
    where: {
      cc,
      date,
    },
  });

  res.status(200).json({ result: 'success' });
}

// 이 모듈을 불러올 때 DB 테이블 조회, 테이블 행 추가, 테이블 행 삭제 함수를 내보낸다.
module.exports = wrapWithErrorHandler({
  getAll,
  insertOrUpdate,
  remove,
});
