
import app from '../src/app';

(async () => {
  try {
    console.log('Cleaning database');
    const sequelize = app.get('sequelizeClient');
    await sequelize.drop({ force: true, cascade: true });

    console.log('running tests');
    // with mocha's "delay" option, we start the tests after initial db connection
    run();

  } catch (err: any) {
    console.error(err.message, { stack: err.stack });
    process.exit(1);
  }
})();
