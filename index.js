// IMPORTS
  const brain = require('brain.js');
  const express = require('express');
// CONSTRUCTOR
  const config = {
    binaryThresh: 0.9, // threshold para a saída binária
    hiddenLayers: [5, 10], // Camadas escondidas com 4 e 8 neurônios
    learningRate: .5, // Taxa de aprendizado de 0,3
    outputLookup: true
  };
  const chatbot = new brain.recurrent.LSTM(config);
  // const chatbot = new brain.recurrent.LSTM();
  const app = express();
  const lib = [];
// APP
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.get('/talk', (req, res) => {
    talk(req.query.text,res);
  });
  app.get('/teach', (req, res) => {
    teach(req.query.text,res);
  });
  app.get('/compile', (req, res) => {
    chatbot.train(lib, {
      errorThresh: 0.011, // erro máximo
      iterations: 300, // número máximo de iterações
      log: (error) => {
        process.stdout.write('\033c');
        console.log(error);
      },
      logPeriod: 10
    });
    console.log('Compilado.');
    console.log(chatbot)
    res.send('Compilado');
  });
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
// TALK
  function talk(user_input,res) {
    const output = chatbot.run(user_input);
    console.log('Pergunta: ' + user_input);
    console.log('Resposta: ' + output);
    res.send(output);
  }
// LEARN
  function teach(user_input,res) {
    var new_trained_data = [user_input];
    lib.push(user_input);
    chatbot.train(new_trained_data, {
      errorThresh: 0.005, // erro máximo
      iterations: (user_input.length * 20), // número máximo de iterações
      log: (error) => {
        process.stdout.write('\033c');
        console.log(error);
      },
      logPeriod: 10
    });
    console.log('Trainamento: ' + new_trained_data);
    console.log(lib)
    res.send(new_trained_data);
  }



