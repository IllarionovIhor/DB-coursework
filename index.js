import express from 'express';
import db from "./case_db.js"
import ProtectionRating from "./entity/protectionRating.js"
import Client from "./entity/client.js"
import SubOrder from "./entity/subOrder.js"
import Case from "./entity/cases.js"
import Order from "./entity/order.js"
import CaseStatus from "./entity/caseStatus.js"
import OrderStatus from "./entity/orderStatus.js"
import { Op } from 'sequelize';
import Sequelize from 'sequelize';
const app = express()
const port = 3000
app.use(express.json());
// app.use(express.urlencoded({extended: true}));





//Cases
//Cases
//Cases
app.get('/cases', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 100;
  const offset = (page - 1) * perPage;
  Case.findAndCountAll({
    include:
    [
      {
        model: ProtectionRating,
        as: 'protection_rating'
      },
      {
        model: CaseStatus,
        as: 'status'
      }
    ],
    attributes: ['name', 'description', 'price', 'weight', 'height', 'width', 'length', 'phone_id', 'id'],
    limit: perPage,
    offset: offset
  })
    .then(cases => {
      res.json({
        currentPage: page,
        cases: cases.rows
      });
    })
    .catch(error => {
      console.error('Помилка:', error);
      res.status(500).json({ error: 'Помилка' });
    });
});

app.post('/cases/', async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const weight = req.body.weight;
    const height = req.body.height;
    const width = req.body.width;
    const length = req.body.length;
    const phone_id = req.body.phone_id;
    const status_id = req.body.status_id;
    const protection_rating_id = req.body.protection_rating_id;
    if (!name || !description || !price || !protection_rating_id || !weight || !height || !width || !length || !phone_id || !status_id) {
      res.json({ error: req.body });
      return;
    }
    const createCase = await Case.create({
      name,
      description,
      price,
      weight,
      height,
      width,
      length,
      phone_id,
      protection_rating_id,
      status_id
    });
    res.json(createCase);
  } catch (error) {
    console.error('Помилка під час додавання чохла:', error);
    res.status(500).json({ error: 'Помилка' });
  }
});

app.delete('/cases/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const aCase = await Case.findByPk(id);
    if (aCase) {
      await aCase.destroy();
      res.send('чехол видалено');
    } else {
      res.status(404).send('чехол не знайдено');
    }
  } catch (error) {
    console.error('Помилка видалення чехла:', error);
    res.status(500).send('Помилка видалення чехла');
  }
});

app.put('/cases/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      name, 
      description, 
      price, 
      weight,
      width,
      height,
      length,
      phone_id,
      protection_rating_id,
      status_id
     } = req.body;
    if (!name || !description || !price || !protection_rating_id || !weight || !height || !width || !length || !phone_id || !status_id) {
      return res.status(400).json({ error: 'Всі поля повинні бути заповнені' });
    }
    const aCase = await Case.findByPk(id);
    if (aCase) {
      aCase.name = name;
      aCase.description = description;
      aCase.price = price;
      aCase.weight = weight;
      aCase.width = width;
      aCase.height = height;
      aCase.length = length;
      aCase.phone_id = phone_id;
      aCase.status_id = status_id;
      aCase.protection_rating_id = protection_rating_id;
      await aCase.save();
      res.json(aCase);
    } else {
      res.status(404).json({ error: 'чехол не знайдено' });
    }
  } catch (error) {
    console.error('Помилка:', error);
    res.status(500).json({ error: 'Помилка' });
  }
});
//Cases
//Cases
//Cases





// subOrder
// subOrder
// subOrder
// subOrder
app.get('/cases/sub-orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    const offset = (page - 1) * perPage;
    const casesOrder = await SubOrder.findAndCountAll({
      limit: perPage,
      offset: offset
    });
    res.json({
      currentPage: page,
      casesOrder: casesOrder.rows
    });
  } catch (error) {
    console.error('Помилка при отриманні:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});

app.post('/cases/sub-order/', async (req, res) => {
  try {
    const amount = req.body.amount;
    const case_id = req.body.case_id;
    const order_id = req.body.order_id;
    const createSubOrder = await SubOrder.create({
      amount,
      case_id,
      order_id
    });
    res.json(createSubOrder);
  } catch (error) {
    console.error('Помилка під час додавання підзамовлення чохла:', error);
    res.status(500).json({ error: 'Помилка' });
  }
});
app.delete('/case/sub-order/:id', async (req, res) => {
  try {
    const case_sub_order = await SubOrder.findByPk(req.params.id);
    if (case_sub_order) {
      await case_sub_order.destroy();
      res.send('Підзамовлення чохла видалено');
    } else {
      res.status(404).send('Підзамовлення чохла не знайдено');
    }
  } catch (error) {
    console.error('Помилка видалення підзамовлення чохла:', error);
    res.status(500).send('Помилка видалення підзамовлення чохла');
  }
});
app.put('/cases/sub-order/:id', async (req, res) => {
  const caseSubOrderId = req.params.id;
  const amount = req.body.amount;
  const case_id = req.body.case_id;
  const order_id = req.body.order_id;
  try {
    const caseSubOrder = await SubOrder.findByPk(caseSubOrderId);
    if (!caseSubOrder) {
      return res.status(404).json({ error: 'Підзамовлення чохла не знайдено' });
    }
    caseSubOrder.amount = amount;
    caseSubOrder.case_id = case_id;
    caseSubOrder.order_id = order_id;
    await caseSubOrder.save();
    res.json({ message: 'Інформація підзамовлення чохла успішно оновлена' });
  } catch (error) {
    console.error('Помилка при оновленні інформації підзамовлення чохла:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
// subOrder
// subOrder
// subOrder
// subOrder



//Order
//Order
//Order
app.get('/cases/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    const offset = (page - 1) * perPage;
    const casesOrder = await Order.findAndCountAll({
      include:
        {
          model: OrderStatus,
          as: 'order_status'
        }
      ,
      limit: perPage,
      offset: offset
    });
    res.json({
      currentPage: page,
      casesOrder: casesOrder.rows
    });
  } catch (error) {
    console.error('Помилка при отриманні:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});

app.post('/cases/order/', async (req, res) => {
  try {
    const ordering_date = req.body.ordering_date;
    const price = req.body.price;
    const client_id = req.body.client_id;
    const status_id = req.body.status_id;
    const createOrder = await Order.create({
      price,
      client_id,
      status_id,
      ordering_date
    });
    res.json(createOrder);
  } catch (error) {
    console.error('Помилка під час додавання замовлення чохла:', error);
    res.status(500).json({ error: 'Помилка' });
  }
});

app.delete('/cases/order/:id', async (req, res) => {
  try {
    const case_order = await Order.findByPk(req.params.id);
    if (case_order) {
      await case_order.destroy();
      res.send('Замовлення чохла видалено');
    } else {
      res.status(404).send('Замовлення чохла не знайдено');
    }
  } catch (error) {
    console.error('Помилка видалення замовлення чохла:', error);
    res.status(500).send('Помилка видалення замовлення чохла');
  }
});

app.put('/cases/order/:id', async (req, res) => {
  const caseOrderId = req.params.id;
  const ordering_date = req.body.ordering_date;
  const client_id = req.body.client_id;
  const status_id = req.body.status_id;
  try {
    const caseOrder = await ProtectionRating.findByPk(caseOrderId);
    if (!caseOrder) {
      return res.status(404).json({ error: 'Замовлення чохла не знайдено' });
    }
    caseOrder.ordering_date = ordering_date;
    caseOrder.client_id = client_id;
    caseOrder.status_id = status_id;
    await caseOrder.save();
    res.json({ message: 'Інформація про замовлення чохла успішно оновлена' });
  } catch (error) {
    console.error('Помилка при оновленні інформації про замовлення чохла:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
//Order
//Order
//Order




//Clients
//Clients
//Clients
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.post('/clients', async (req, res) => {
  try {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const address = req.body.address;
    const password = req.body.password;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Неправильний формат електронної пошти' });
    }
    const newClient = await Client.create({
      first_name: firstName,
      last_name: lastName,
      email,
      address,
      password
    });
    res.json(newClient);
  } catch (error) {
    console.error('Помилка під час додавання клієнта:', error);
    res.json({ error: 'error' });
  }
});
app.get('/clients', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    const offset = (page - 1) * perPage;
    const clients = await Client.findAndCountAll({
      limit: perPage,
      offset: offset
    });
    res.json({
      currentPage: page,
      clients: clients.rows
    });
  } catch (error) {
    console.error('Помилка при отриманні клієнтів:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
//C
app.delete('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  try {
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Клієнт не знайдений' });
    }
    await client.destroy();
    res.json({ message: 'Клієнт успішно видалений' });
  } catch (error) {
    console.error('Помилка при видаленні клієнта:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
//C
app.put('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  const { first_name, last_name, email, address, password } = req.body;
  try {
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Клієнт не знайдений' });
    }
    client.first_name = first_name;
    client.last_name = last_name;
    client.email = email;
    client.address = address;
    client.password = password;
    await client.save();
    res.json({ message: 'Інформація про клієнта успішно оновлена' });
  } catch (error) {
    console.error('Помилка при оновленні інформації про клієнта:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
//Clients
//Clients
//Clients


//ProtectionRating
//ProtectionRating
//ProtectionRating
app.get('/protection-raiting', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    const offset = (page - 1) * perPage;
    const protectionRatings = await ProtectionRating.findAndCountAll({
      limit: perPage,
      offset: offset
    });
    res.json({
      currentPage: page,
      protectionRatings: protectionRatings.rows
    });
  } catch (error) {
    console.error('Помилка при отриманні рейтингів захисту:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
app.get('/protection-raiting/:id', async (req, res) => {
  try {
    const protectionRatingsId = req.params.id;
    const protectionRating = await ProtectionRating.findByPk(protectionRatingsId);
    if (!protectionRating) {
      return res.status(404).json({ error: 'Категорія не знайдена' });
    }
    res.json(protectionRating);
  } catch (error) {
    console.error('Помилка при отриманні категорії за ідентифікатором:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});

app.get('/protection-raiting/:title', (req, res) => {
  const protectionRatingTitle = req.params.title;
  ProtectionRating.findOne({ where: { title: protectionRatingTitle } })
    .then(protectionRating => {
      if (!protectionRating) {
        return res.json({ error: `захисний рейтинг [${protectionRatingTitle}] не знайдено` });
      }
      return Case.findAll({
        where: { protection_raiting_id: protectionRating.id },
        attributes: ['name', 'description', 'price']
      });
    })
    .then(cases => {
      if (!cases || cases.length === 0) {
        return res.json({ error: `Чохли в захисному рейтингу не знайдені` });
      }
      res.json(cases);
    })
    .catch(error => {
      console.error('Помилка:', error);
      res.status(500).json({ error: 'Помилка' });
    });
});

app.post('/protection-raiting/', async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const water = req.body.water;
    const kenetic = req.body.kenetic;
    const coverage = req.body.coverage;
    const newCateg = await ProtectionRating.create({ title, description, water, kenetic, coverage });
    res.json(newCateg);
  }
  catch (error) {
    console.error('Помилка створення захисного рейтингу:', error);
    res.send('Помилка створення захисного рейтингу');
  }

});

app.put('/protection-raiting/:id', async (req, res) => {
  const protectionRatingId = req.params.id;
  const { title, description, water, kenetic, coverage } = req.body;
  try {
    const protectionRating = await ProtectionRating.findByPk(protectionRatingId);
    if (!protectionRating) {
      return res.status(404).json({ error: 'захисний рейтинг не знайдений' });
    }
    protectionRating.title = title;
    protectionRating.description = description;
    protectionRating.water = water;
    protectionRating.kenetic = kenetic;
    protectionRating.coverage = coverage;
    await protectionRating.save();
    res.json({ message: 'Інформація про захисний рейтинг успішно оновлений' });
  } catch (error) {
    console.error('Помилка при оновленні інформації про захисний рейтинг:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});

app.delete('/protection-raiting/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const protectionRating = await ProtectionRating.findByPk(id);
    if (protectionRating) {
      await protectionRating.destroy();
      res.send('category deleted');
    } else {
      res.status(404).send('category not found');
    }
  } catch (error) {
    console.error('Помилка видалення категорії:', error);
    res.status(500).send('Помилка видалення категорії');
  }
});
//ProtectionRating
//ProtectionRating
//ProtectionRating


// statuses
// statuses
// statuses
// statuses
app.get('/status-order', async (req, res) => {
  try {
    const id = req.params.id
    const statusOrders = await OrderStatus.findAll();

    res.json(statusOrders);
  } catch (error) {
    console.error('Помилка при отриманні замовлень з вашим статусом:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
app.get('/status-case', async (req, res) => {
  try {
    const id = req.params.id
    const status = await CaseStatus.findAll();

    res.json(status);
  } catch (error) {
    console.error('Помилка при отриманні замовлень з вашим статусом:', error);
    res.status(500).json({ error: 'Помилка при обробці запиту' });
  }
});
app.post('/status-order', async (req, res) => {
  try {
    const {title, description} = req.body;
    const newOrStat = await OrderStatus.create({ title, description});
    res.json(newOrStat);
  }
  catch (error) {
    console.error('Помилка створення статусу:', error);
    res.send('Помилка створення статусу');
  }

});
app.post('/status-case', async (req, res) => {
  try {
    const {title, description} = req.body;
    const newCaStat = await CaseStatus.create({ title, description});
    res.json(newCaStat);
  }
  catch (error) {
    console.error('Помилка створення статусу:', error);
    res.send('Помилка створення статусу');
  }
});

app.put('/status-order/:id', async (req, res) => {
  try {
  const statusId = req.params.id;
  const {title, description} = req.body;
  const status = await OrderStatus.findByPk(statusId);
  if (!status) {
    return res.status(404).json({ error: 'статус не знайдений' });
  }
  status.title = title;
  status.description = description;
  await status.save();
  res.json({ message: 'Інформація про статус успішно оновлений' });
  }
  catch (error) {
    console.error('Помилка оновлення статусу:', error);
    res.send('Помилка оновлення статусу');
  }

});
app.put('/status-case/:id', async (req, res) => {
  try {
  const statusId = req.params.id;
  const {title, description} = req.body;
  const status = await CaseStatus.findByPk(statusId);
  if (!status) {
    return res.status(404).json({ error: 'статус не знайдений' });
  }
  status.title = title;
  status.description = description;
  await status.save();
  res.json({ message: 'Інформація про статус успішно оновлений' });
  }
  catch (error) {
    console.error('Помилка оновлення статусу:', error);
    res.send('Помилка оновлення статусу');
  }

});
app.delete('/status-order/:id', async (req, res) => {
  try {
  const statusId = req.params.id;
  const status = await OrderStatus.findByPk(statusId);
  if (status) {
    await status.destroy();
    res.send('status deleted');
  } else {
    res.status(404).send('status not found');
  }
  }
  catch (error) {
    console.error('Помилка видалення статусу:', error);
    res.send('Помилка видалення статусу');
  }

});
app.delete('/status-case/:id', async (req, res) => {
  try {
  const statusId = req.params.id;
  const status = await CaseStatus.findByPk(statusId);
  if (status) {
    await status.destroy();
    res.send('status deleted');
  } else {
    res.status(404).send('status not found');
  }
  }
  catch (error) {
    console.error('Помилка видалення статусу:', error);
    res.send('Помилка видалення статусу');
  }

});
// statuses
// statuses
// statuses
// statuses



// more complex crud stuff

//запит на отриманя клієнтів разом з статусами їх замовлень
app.get('/clients/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const offset = (page - 1) * perPage;
    const clientsWithOrders = await Order.findAndCountAll({
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: OrderStatus,
          as: 'order_status',
          attributes: ['title'],
        }
      ],
      attributes: ['id', 'ordering_date'],
      limit: perPage,
      offset: offset
    });
    const totalPages = Math.ceil(clientsWithOrders.count / perPage);
    res.json({
      totalItems: clientsWithOrders.count,
      totalPages: totalPages,
      currentPage: page,
      clientsWithOrders: clientsWithOrders.rows
    });
  } catch (error) {
    console.error('Помилка при отриманні клієнтів:', error);
    res.status(500).json({ error: 'Помилка' });
  }
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

