import React, { useState } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { formatDateForAPI, formatDateForDisplay, isValidAPIDateFormat } from '../../utils/dateUtils';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const DateFormatTest = () => {
  const [testResults, setTestResults] = useState([]);

  const runTests = () => {
    const tests = [
      {
        name: 'Current Date',
        input: dayjs(),
        expected: 'yyyy-MM-ddTHH:mm:ss format'
      },
      {
        name: 'Sample Event Date',
        input: dayjs('2025-09-10T14:00:00'),
        expected: '2025-09-10T14:00:00'
      },
      {
        name: 'Another Date',
        input: dayjs('2025-12-25T18:30:45'),
        expected: '2025-12-25T18:30:45'
      }
    ];

    const results = tests.map(test => {
      const formatted = formatDateForAPI(test.input);
      const isValid = isValidAPIDateFormat(formatted);
      const displayFormat = formatDateForDisplay(test.input);
      
      return {
        ...test,
        result: formatted,
        isValid,
        displayFormat,
        success: isValid && (test.expected === 'yyyy-MM-ddTHH:mm:ss format' || formatted === test.expected)
      };
    });

    setTestResults(results);
  };

  return (
    <Card title="Date Format Test" style={{ margin: '20px 0' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" onClick={runTests}>
          Run Date Format Tests
        </Button>

        {testResults.length > 0 && (
          <div>
            <Title level={4}>Test Results:</Title>
            {testResults.map((result, index) => (
              <Alert
                key={index}
                type={result.success ? 'success' : 'error'}
                message={`Test: ${result.name}`}
                description={
                  <div>
                    <Paragraph>
                      <Text strong>Input:</Text> {result.input.format('YYYY-MM-DD HH:mm:ss')}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>API Format:</Text> {result.result}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Display Format:</Text> {result.displayFormat}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Valid Format:</Text> {result.isValid ? 'Yes' : 'No'}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Expected:</Text> {result.expected}
                    </Paragraph>
                  </div>
                }
                style={{ marginBottom: 8 }}
              />
            ))}
          </div>
        )}

        <Card size="small" title="Format Information">
          <Paragraph>
            <Text strong>Required API Format:</Text> yyyy-MM-ddTHH:mm:ss
          </Paragraph>
          <Paragraph>
            <Text>Examples:</Text>
            <ul>
              <li>2025-09-10T14:00:00</li>
              <li>2025-12-25T18:30:45</li>
              <li>2024-01-01T00:00:00</li>
            </ul>
          </Paragraph>
        </Card>
      </Space>
    </Card>
  );
};

export default DateFormatTest;
