import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const App = () => {
  const [inputs, setInputs] = useState({
    pemilikSah: '',
    atasNama: '',
    tandaTanganMaterai: '',
    dokumenPendukung: '',
    pajakTanahLunas: '',
    sengketaHukum: '',
    buktiPembayaran: '',
    perjanjianKontrak: ''
  });

  const [calculationLog, setCalculationLog] = useState([]);
  const [result, setResult] = useState('');

  const handleInputChange = (key, value) => {
    setInputs({ ...inputs, [key]: value });
  };

  const evaluateDocument = () => {
    const userInputs = {
      pemilikSah: parseFloat(inputs.pemilikSah || 0),
      atasNama: parseFloat(inputs.atasNama || 0),
      tandaTanganMaterai: parseFloat(inputs.tandaTanganMaterai || 0),
      dokumenPendukung: parseFloat(inputs.dokumenPendukung || 0),
      pajakTanahLunas: parseFloat(inputs.pajakTanahLunas || 0),
      sengketaHukum: parseFloat(inputs.sengketaHukum || 0),
      buktiPembayaran: parseFloat(inputs.buktiPembayaran || 0),
      perjanjianKontrak: parseFloat(inputs.perjanjianKontrak || 0)
    };

    const mb = {
      pemilikSah: 0.8,
      atasNama: 0.7,
      tandaTanganMaterai: 0.85,
      dokumenPendukung: 0.9,
      pajakTanahLunas: 1,
      sengketaHukum: 0.6,
      buktiPembayaran: 0.75,
      perjanjianKontrak: 0.7
    };

    const md = {
      pemilikSah: 0.2,
      atasNama: 0.3,
      tandaTanganMaterai: 0.15,
      dokumenPendukung: 0.1,
      pajakTanahLunas: 0,
      sengketaHukum: 0.4,
      buktiPembayaran: 0.25,
      perjanjianKontrak: 0.3
    };

    const cfExpert = {};
    const log = [];
    for (let key in mb) {
      cfExpert[key] = mb[key] - md[key];
      log.push(
        `CF Pakar (${key}): MB(${mb[key]}) - MD(${md[key]}) = ${cfExpert[key].toFixed(2)}`
      );
    }

    const cfUser = {};
    for (let key in userInputs) {
      cfUser[key] = userInputs[key] * cfExpert[key];
      log.push(
        `CF User (${key}): Jawaban(${userInputs[key]}) * CF Pakar(${cfExpert[key].toFixed(
          2
        )}) = ${cfUser[key].toFixed(2)}`
      );
    }

    let cfTotal = 0;
    for (let key in cfUser) {
      cfTotal = combineCF(cfTotal, cfUser[key]);
      log.push(`Kombinasi CF (${key}): CF Total(${cfTotal.toFixed(2)})`);
    }

    const bisaPercentage = (cfTotal * 100).toFixed(2);
    const tidakBisaPercentage = ((1 - cfTotal) * 100).toFixed(2);

    log.push(`CF Total: ${cfTotal.toFixed(2)}`);
    log.push(`Persentase Bisa: ${bisaPercentage}%`);
    log.push(`Persentase Tidak Bisa: ${tidakBisaPercentage}%`);

    setCalculationLog(log);
    setResult(
      `Bisa: ${bisaPercentage}%\nTidak Bisa: ${tidakBisaPercentage}%`
    );
  };

  const combineCF = (cf1, cf2) => {
    return cf1 + cf2 * (1 - Math.abs(cf1));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Evaluasi Dokumen</Text>
      {[
        'pemilikSah',
        'atasNama',
        'tandaTanganMaterai',
        'dokumenPendukung',
        'pajakTanahLunas',
        'sengketaHukum',
        'buktiPembayaran',
        'perjanjianKontrak'
      ].map((key, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>
            {index + 1}. {key.replace(/([A-Z])/g, ' $1')} (Ya = 1, Tidak = 0):
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={inputs[key]}
            onChangeText={(value) => handleInputChange(key, value)}
          />
        </View>
      ))}
      <Button title="Evaluasi" onPress={evaluateDocument} />
      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Hasil:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Detail Perhitungan:</Text>
        {calculationLog.map((item, index) => (
          <Text key={index} style={styles.logText}>
            {item}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  inputContainer: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d9f9d9',
    borderRadius: 5
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  resultText: {
    fontSize: 16
  },
  logContainer: {
    marginTop: 20
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  logText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555'
  }
});

export default App;
