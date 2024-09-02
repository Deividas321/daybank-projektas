const express = require('express');
const app = express();
app.use(express.json());

// Nurodykite, kad public aplankas aptarnaus statinius failus (HTML, CSS, JS)
app.use(express.static('public'));

let accounts = []; // Paprastas sąrašas saugoti sąskaitoms

// Padeda sukurti "saugų" sąskaitos identifikatorių (vardas-pavardė)
const generateAccountId = (firstName, lastName) => {
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
};

// Formatuoja eurus į pinigų formatą su Eur (pvz., 123.45 -> 123,45 Eur)
const formatMoney = (amount) => {
  return `${amount.toFixed(2).replace('.', ',')} Eur`;
};

// API endpoint'as - sukurti naują sąskaitą
app.post('/api/account', (req, res) => {
  const { vardas, pavarde, gimimoData } = req.body;

  // Patikrina, ar asmuo yra pilnametis (18 metų)
  const birthDate = new Date(gimimoData);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (age < 18) {
    return res.status(400).json({ error: 'Turite būti bent 18 metų amžiaus.' });
  }

  const accountId = generateAccountId(vardas, pavarde);

  // Patikrina, ar sąskaita jau egzistuoja
  if (accounts.find(acc => acc.id === accountId)) {
    return res.status(400).json({ error: 'Sąskaita su šiuo vardu ir pavarde jau egzistuoja.' });
  }

  // Sukuriama nauja sąskaita
  const newAccount = {
    id: accountId,
    vardas,
    pavarde,
    gimimoData,
    balance: 0
  };

  accounts.push(newAccount);
  res.status(201).json(newAccount);
});

// API endpoint'as - gauti sąskaitos informaciją
app.get('/api/account/:id', (req, res) => {
  const accountId = req.params.id.toLowerCase();
  const account = accounts.find(acc => acc.id === accountId);
  
  if (!account) {
    return res.status(404).json({ error: 'Sąskaita nerasta.' });
  }
  
  res.json({
    vardas: account.vardas,
    pavarde: account.pavarde,
    gimimoData: account.gimimoData,
    balance: formatMoney(account.balance) // Grąžinamas ir balansas
  });
});

// API endpoint'as - ištrinti sąskaitą
app.delete('/api/account/:id', (req, res) => {
  const accountId = req.params.id.toLowerCase();
  const accountIndex = accounts.findIndex(acc => acc.id === accountId);

  if (accountIndex === -1) {
    return res.status(404).json({ error: 'Sąskaita nerasta.' });
  }

  if (accounts[accountIndex].balance !== 0) {
    return res.status(400).json({ error: 'Negalite ištrinti sąskaitos su likučiu.' });
  }

  accounts.splice(accountIndex, 1);
  res.status(204).end();
});

// API endpoint'as - atnaujinti sąskaitos informaciją
app.put('/api/account/:id', (req, res) => {
  const accountId = req.params.id.toLowerCase();
  const accountIndex = accounts.findIndex(acc => acc.id === accountId);

  if (accountIndex === -1) {
    return res.status(404).json({ error: 'Sąskaita nerasta.' });
  }

  const { vardas, pavarde, gimimoData } = req.body;
  accounts[accountIndex] = {
    ...accounts[accountIndex],
    vardas,
    pavarde,
    gimimoData
  };

  res.json(accounts[accountIndex]);
});

// API endpoint'ai - vardas, pavarde, gimimoData GET ir PUT

app.get('/api/account/:id/name', (req, res) => {
  const account = accounts.find(acc => acc.id === req.params.id.toLowerCase());
  if (!account) return res.status(404).json({ error: 'Sąskaita nerasta.' });
  res.json({ vardas: account.vardas });
});

app.put('/api/account/:id/name', (req, res) => {
  const account = accounts.find(acc => acc.id === req.params.id.toLowerCase());
  if (!account) return res.status(404).json({ error: 'Sąskaita nerasta.' });
  account.vardas = req.body.vardas;
  res.json(account);
});

app.get('/api/account/:id/surname', (req, res) => {
  const account = accounts.find(acc => acc.id === req.params.id.toLowerCase());
  if (!account) return res.status(404).json({ error: 'Sąskaita nerasta.' });
  res.json({ pavarde: account.pavarde });
});

app.put('/api/account/:id/surname', (req, res) => {
  const account = accounts.find(acc => acc.id === req.params.id.toLowerCase());
  if (!account) return res.status(404).json({ error: 'Sąskaita nerasta.' });
  account.pavarde = req.body.pavarde;
  res.json(account);
});

app.get('/api/account/:id/dob', (req, res) => {
  const account = accounts.find(acc => acc.id === req.params.id.toLowerCase());
  if (!account) return res.status(404).json({ error: 'Sąskaita nerasta.' });
  res.json({ gimimoData: account.gimimoData });
});

app.put('/api/account/:id/dob', (req, res) => {
  const account = accounts.find(acc => acc.id === req.params.id.toLowerCase());
  if (!account) return res.status(404).json({ error: 'Sąskaita nerasta.' });
  account.gimimoData = req.body.gimimoData;
  res.json(account);
});

// API endpoint'as - pinigų įnešimas į sąskaitą
app.post('/api/deposit', (req, res) => {
  const { piniguKiekis, vardas, pavarde } = req.body;
  const accountId = generateAccountId(vardas, pavarde);
  const account = accounts.find(acc => acc.id === accountId);

  if (!account) {
    return res.status(404).json({ error: 'Sąskaita nerasta.' });
  }

  // Convert piniguKiekis to euros
  const depositAmount = parseFloat(piniguKiekis.replace(',', '.'));

  account.balance += depositAmount;
  res.json({ balance: formatMoney(account.balance) });
});

// API endpoint'as - pinigų išėmimas iš sąskaitos
app.post('/api/withdrawal', (req, res) => {
  const { piniguKiekis, vardas, pavarde } = req.body;
  const accountId = generateAccountId(vardas, pavarde);
  const account = accounts.find(acc => acc.id === accountId);

  if (!account) {
    return res.status(404).json({ error: 'Sąskaita nerasta.' });
  }

  // Convert piniguKiekis to euros
  const withdrawalAmount = parseFloat(piniguKiekis.replace(',', '.'));

  if (account.balance < withdrawalAmount) {
    return res.status(400).json({ error: 'Nepakanka lėšų sąskaitoje.' });
  }

  account.balance -= withdrawalAmount;
  res.json({ balance: formatMoney(account.balance) });
});

// API endpoint'as - pervesti pinigus tarp sąskaitų
app.post('/api/transfer', (req, res) => {
  const { isVardas, isPavarde, iVardas, iPavarde, piniguKiekis } = req.body;
  const fromAccountId = generateAccountId(isVardas, isPavarde);
  const toAccountId = generateAccountId(iVardas, iPavarde);

  const fromAccount = accounts.find(acc => acc.id === fromAccountId);
  const toAccount = accounts.find(acc => acc.id === toAccountId);

  if (!fromAccount || !toAccount) {
    return res.status(404).json({ error: 'Viena ar abi sąskaitos nerastos.' });
  }

  // Convert piniguKiekis to euros
  const transferAmount = parseFloat(piniguKiekis.replace(',', '.'));

  if (fromAccount.balance < transferAmount) {
    return res.status(400).json({ error: 'Nepakanka lėšų sąskaitoje.' });
  }

  fromAccount.balance -= transferAmount;
  toAccount.balance += transferAmount;

  res.json({
    fromAccount: { balance: formatMoney(fromAccount.balance) },
    toAccount: { balance: formatMoney(toAccount.balance) }
  });
});
app.delete('/api/account/:accountId', (req, res) => {
  const accountId = req.params.accountId;

  // Get account info to check balance
  const account = getAccountById(accountId); // Replace with your actual function to get account

  if (!account) {
      return res.status(404).json({ message: 'Sąskaita nerasta.' });
  }

  if (account.balance > 0) {
      return res.status(400).json({ message: 'Sąskaita turi pinigų ir negali būti ištrinta.' });
  }

  // Proceed with deletion
  deleteAccountById(accountId); // Replace with your actual function to delete account

  res.status(200).json({ message: 'Sąskaita sėkmingai ištrinta.' });
});
// Serverio paleidimas
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveris veikia ant prievado http://localhost:${PORT}`);
});