import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

//componentes
import PageHeader from '@/components/ui/PageHeader';

const ServicePending = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View>
            <PageHeader 
              title="Pendência de serviço" 
              containerStyle={{backgroundColor: Colors.azulClaro}} 
              titleStyle={{color: '#fff'}}
            />      
        </View> 
    </SafeAreaView>
  );
};

export default ServicePending;

const styles = StyleSheet.create({});