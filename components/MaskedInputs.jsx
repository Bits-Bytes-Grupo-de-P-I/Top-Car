import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Componente para CPF/CNPJ
const CpfCnpjInput = ({ label, value, onChangeText, placeholder, ...props }) => {
  const [maskedValue, setMaskedValue] = useState('');

  const applyMask = (text) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned?.length <= 11) {
      // Máscara de CPF: 000.000.000-00
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // Máscara de CNPJ: 00.000.000/0000-00
      return cleaned
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  const handleChangeText = (text) => {
    const masked = applyMask(text);
    setMaskedValue(masked);
    
    const numbersOnly = text.replace(/\D/g, '');
    onChangeText && onChangeText(numbersOnly);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={props.valor}
        onChangeText={handleChangeText}
        placeholder={placeholder || "CPF ou CNPJ"}
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={18}
        {...props}
      />
    </View>
  );
};

// Componente para Telefone/Celular
const PhoneInput = ({ label, value, onChangeText, placeholder, ...props }) => {
  const [maskedValue, setMaskedValue] = useState('');

  const applyMask = (text) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned?.length <= 10) {
      // Máscara de telefone fixo: (00) 0000-0000
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      // Máscara de celular: (00) 00000-0000
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  };

  const handleChangeText = (text) => {
    const masked = applyMask(text);
    setMaskedValue(masked);
    
    const numbersOnly = text.replace(/\D/g, '');
    onChangeText && onChangeText(numbersOnly);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={props.valor}
        onChangeText={handleChangeText}
        placeholder={placeholder || "Telefone ou Celular"}
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={15}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    fontFamily: "DM-Sans"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: "100%",
    color: "#333",
    fontFamily: "DM-Sans"
  },
});

export { CpfCnpjInput, PhoneInput };