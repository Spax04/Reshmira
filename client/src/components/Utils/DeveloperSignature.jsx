import { StyleSheet, Text, View } from 'react-native';
import { VARS } from '../../constants';

// Replace with your actual version variable
const APP_VERSION = VARS.APP_VERSION; // Example version

const DeveloperSignature = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.developerText}>
        Developed by 
        <Text style={styles.nameText}> Alexander Gotlib</Text> 
        <Text style={styles.aliasText}> aka Spax</Text>
      </Text>
      <Text style={styles.versionText}>Version: {APP_VERSION}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
        borderTopColor: '#ddd',
    marginTop:10    // Subtle border for separation
  },
  developerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  nameText: {
    fontSize: 16,
    color: '#00adf5', // Vibrant color for the name
    fontWeight: 'bold',
  },
  aliasText: {
    fontSize: 16,
    color: '#555', // Subtle color for alias
    fontStyle: 'italic', // Italic style for emphasis
  },
  versionText: {
    marginTop: 4,
    fontSize: 14,
    color: '#777', // Lighter color for the version
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default DeveloperSignature;
