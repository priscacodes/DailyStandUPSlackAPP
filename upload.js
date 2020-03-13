const xlsx = require('xlsx');
const path = require('path');
const models = require('./build/models');

const { Standup } = models;

const uploadStandup = async () => {
  const filePath = path.resolve(__dirname, 'stand.xlsx');
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = await xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  const sheetArray = await sheet.map(x => ({
    name: x.Name || '',
    project: x.Project ? x.Project : '',
    last24hour: x['Last 24 hours'] || '',
    next24hour: x['Next 24  hours'] || '',
    blockers: x.Blockers || '',
    team_domain: x.team_domain || '',
    team_id: x.team_id || '',
    createdAt: x.createdAt.split(' ')[0],
  }));
  // console.log(sheet);
  console.log(sheetArray);
  await Standup.bulkCreate(sheetArray, { returning: true });
};

module.exports = { uploadStandup };
