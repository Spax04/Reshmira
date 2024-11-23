import { StyleSheet, Text, View } from 'react-native';
import React,{useState,useEffect} from 'react';
import ShiftComponent from './ShiftComponent';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { COLORS } from '../../constants';

const DayComponent = ({ date, shifts, navigation,isTableView }) => {

  const [headers,setHeaders] = useState([])
  const [tableData,setTableData] = useState([]) // Array with arrays (each inner array is a row data)

useEffect(()=>{

  const tempHeaders = ['שעה']

  const tempData = []
  for(let i = 0; i< shifts.length;i ++){
    const tempShiftRow = []

    if(i ===0){
      shifts[i].positions.forEach(position=> tempHeaders.push(position.position_name))    
    };

    tempShiftRow.push(shifts[i].startTime)

    shifts[i].positions.forEach(pos =>{

      let guardsList = ''
      console.log(pos);
      pos.guards.forEach((g)=>{
        guardsList = guardsList.concat("\n", g.fullName)
      } )
      console.log("Guards list");
      console.log(guardsList);
      tempShiftRow.push(guardsList)
    })
    

    tempData.push(tempShiftRow.reverse())
  }
  setTableData(tempData.reverse())
  setHeaders(tempHeaders.reverse())
},[shifts])


  return (
    <View style={styles.container}>
       <Text style={styles.dayText}>{date}</Text>
      {
      isTableView?
      <>
      <Table>
          <Row data={headers} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
      </Table>
      </>
      :
      <>     
      {
      shifts.map((shift, index) => (
        <ShiftComponent
          key={index}
          startTime={shift.startTime}
          endTime={shift.endTime}
          positions={shift.positions}
          date={date}
          navigation={navigation} 
        />
      ))}
      </>
      }
      
    </View>
  );
};

export default DayComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right'
  },
  head: {  height: 40,  backgroundColor: COLORS.mainYellowL  },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: {  height: 28  },
  text: { textAlign: 'center' }
});
