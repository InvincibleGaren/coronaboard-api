const { GlobalStat } = require('../database');
// const { wrapWithErrorHandler } = require('../util');

//테이블의 모든 행들을 검색한 뒤 데이터를 반환한다.
async function getAll(req, res) {
  
  const result = await GlobalStat.findAll();
  res.status(200).json({ result });
}

//들어온 데이터를 이용해 DB 테이블에 행을 추가한다.
async function insertOrUpdate(req, res) {

  const { cc, date } = req.body;
  //들어온 데이터에 국가, 날짜 내용이 없다면 error를 출력한다.
  if (!cc || !date) {
    res.status(400).json({ error: 'cc and date are required' });
    return;
  }

  const count = await GlobalStat.count({ where: { cc, date } });

  // 들어온 데이터가 테이블에 존재하지 않으면 데이터를 토대로 새로운 테이블의 행을 추가한다.
  if (count === 0) {
    await GlobalStat.create(req.body);
  
  // 들어온 데이터가 테이블의 존재하면 기존에 존재하는 테이블 행을 업데이트한다.
  } else {
    await GlobalStat.update(req.body, { where: { cc, date } });
  }
  res.status(200).json({ result: 'success' });
}

//들어온 데이터를 이용해 DB 테이블의 행을 삭제한다.
async function remove(req, res) {
  
  //들어온 데이터에 국가, 날짜 내용이 없다면 error를 출력한다.
  const { cc, date } = req.body;
  if (!cc || !date) {
    res.status(400).json({ error: 'cc and date are required' });
    return;
  }

  await GlobalStat.destroy({
    where: {
      cc,
      date,
    },
  });

  res.status(200).json({ result: 'success' });
}

module.exports = {
  getAll,
  insertOrUpdate,
  remove,
};
