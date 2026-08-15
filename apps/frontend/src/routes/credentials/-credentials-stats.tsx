import type { VerifiableCredential } from "@scc/backend/api-client";
import { Card, Flex, Statistic } from "antd";
import { useMemo } from "react";

type CredentialsStatsProps = {
  currentTime: number;
  credentials: VerifiableCredential[];
};

const CredentialsStats: React.FC<CredentialsStatsProps> = ({
  credentials,
  currentTime,
}) => {
  // get a list of all the credentials that have not expired and that are not waiting to become valid
  const validCredentials = useMemo(() => {
    return credentials.filter((credential: VerifiableCredential) => {
      if (!credential.validFrom && !credential.validUntil) return true;
      if (credential.validFrom) {
        const validFrom = new Date(credential.validFrom);
        if (currentTime < validFrom.getTime()) return false;
      }
      if (credential.validUntil) {
        const validUntil = new Date(credential.validUntil);
        if (validUntil.getTime() < currentTime) return false;
      }

      return true;
    });
  }, [credentials, currentTime]);

  return (
    <Flex gap={10}>
      <Card style={{ flexGrow: 1 }}>
        <Statistic title="#Credentials" value={credentials.length} />
      </Card>
      <Card style={{ flexGrow: 1 }}>
        <Statistic
          title="#Active Credentials"
          value={validCredentials.length}
        />
      </Card>
    </Flex>
  );
};

export default CredentialsStats;
