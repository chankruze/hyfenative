import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Alert,
  AppBar,
  AppModal,
  Avatar,
  Badge,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  Chip,
  EmptyState,
  ErrorState,
  Field,
  FieldDescription,
  FieldLabel,
  Form,
  HStack,
  Input,
  Radio,
  Screen,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Switch,
  TabBar,
  Tag,
  TextArea,
  type SelectOption,
  toast,
} from '@/components';
import { AppRoute } from '@/navigation/routes';
import type { RootStackScreenProps } from '@/navigation/navigation-types';
import { useThemeValue } from '@/theme';
import type { Theme } from '@/theme';

type Props = RootStackScreenProps<AppRoute.UiDemo>;

const selectOptions: SelectOption[] = [
  { label: 'Temple', value: 'temple' },
  { label: 'Home', value: 'home' },
  { label: 'Online', value: 'online' },
];

const tabs = [
  { key: 'overview', label: 'Overview', icon: 'view-dashboard-outline' as const },
  { key: 'items', label: 'Items', icon: 'format-list-bulleted' as const },
  { key: 'profile', label: 'Profile', icon: 'account-outline' as const },
];

export function UiDemoScreen({ navigation }: Props) {
  const theme = useThemeValue();
  const styles = createStyles(theme);

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [service, setService] = useState<string | undefined>();
  const [allowUpdates, setAllowUpdates] = useState(true);
  const [consent, setConsent] = useState(false);
  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [tab, setTab] = useState('overview');

  const [showModal, setShowModal] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  return (
    <Screen scroll>
      <Stack spacing="md" style={styles.page}>
        <AppBar
          title="Component Gallery"
          subtitle="Grouped exports + design system primitives"
          left={
            <Button
              variant="ghost"
              size="sm"
              title="Back"
              onPress={() => navigation.navigate(AppRoute.Welcome)}
            />
          }
        />

        <Card elevation="md">
          <Stack spacing="sm">
            <Text style={styles.sectionTitle}>Essentials + Data Display</Text>
            <HStack spacing="xs" style={styles.wrap}>
              <Badge label="v1" variant="primary" />
              <Tag label="Mobile" icon="cellphone" />
              <Chip label="Selected" selected />
              <Avatar name="Hyfe Native" />
            </HStack>
            <HStack spacing="xs" style={styles.wrap}>
              <Button title="Primary" size="sm" />
              <Button title="Secondary" variant="secondary" size="sm" />
              <Button title="Ghost" variant="ghost" size="sm" />
              <Button title="Delete" variant="destructive" size="sm" />
            </HStack>
          </Stack>
        </Card>

        <Card>
          <Stack spacing="sm">
            <Text style={styles.sectionTitle}>Forms</Text>
            <Form spacing="sm">
              <Field>
                <FieldLabel htmlFor="demo-name">Name</FieldLabel>
                <Input
                  id="demo-name"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Rohan"
                />
                <FieldDescription>
                  Name shown on booking confirmations.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="demo-notes">Notes</FieldLabel>
                <TextArea
                  id="demo-notes"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Anything priests should know"
                />
              </Field>

              <Field>
                <FieldLabel>Service Type</FieldLabel>
                <Select
                  value={service}
                  onValueChange={setService}
                  options={selectOptions}
                  placeholder="Choose one"
                />
              </Field>

              <HStack spacing="sm" style={styles.alignCenter}>
                <Switch value={allowUpdates} onValueChange={setAllowUpdates} />
                <Text style={styles.body}>Get updates</Text>
              </HStack>

              <Checkbox
                checked={consent}
                onCheckedChange={setConsent}
                label="I accept terms"
              />

              <HStack spacing="md" style={styles.wrap}>
                <Radio
                  selected={channel === 'sms'}
                  onSelect={() => setChannel('sms')}
                  label="SMS"
                />
                <Radio
                  selected={channel === 'email'}
                  onSelect={() => setChannel('email')}
                  label="Email"
                />
              </HStack>
            </Form>
          </Stack>
        </Card>

        <Card>
          <Stack spacing="sm">
            <Text style={styles.sectionTitle}>Feedback + Toast</Text>
            <Alert
              title="Heads up"
              description="Your profile is 80% complete."
            />
            <HStack spacing="sm" style={styles.wrap}>
              <Spinner />
              <Skeleton width={140} />
            </HStack>
            <HStack spacing="sm" style={styles.wrap}>
              <Button
                size="sm"
                title="Show Toast"
                onPress={() => toast.success('Saved successfully')}
              />
              <Button
                size="sm"
                variant="secondary"
                title="Show Snackbar"
                onPress={() =>
                  toast.snackbar('Message deleted', 'Undo', () =>
                    toast.info('Undo action clicked'),
                  )
                }
              />
            </HStack>
            <EmptyState
              title="No bookings"
              description="Create one to see it here."
            />
            <ErrorState
              title="Payment failed"
              description="Try again after checking your network."
              actionLabel="Retry"
              onActionPress={() => {}}
            />
          </Stack>
        </Card>

        <Card>
          <Stack spacing="sm">
            <Text style={styles.sectionTitle}>Navigation + Overlay</Text>
            <TabBar items={tabs} activeKey={tab} onChange={setTab} />

            <HStack spacing="sm" style={styles.wrap}>
              <Button
                size="sm"
                title="Open Modal"
                onPress={() => setShowModal(true)}
              />
              <Button
                size="sm"
                variant="secondary"
                title="Open Sheet"
                onPress={() => setShowSheet(true)}
              />
            </HStack>
          </Stack>
        </Card>
      </Stack>

      <AppModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Demo Modal"
        footer={
          <Button
            title="Close"
            variant="secondary"
            onPress={() => setShowModal(false)}
            fullWidth
          />
        }
      >
        <Text style={styles.body}>Token-based modal wrapper.</Text>
      </AppModal>

      <BottomSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        title="Demo Bottom Sheet"
        footer={
          <Button
            title="Done"
            onPress={() => setShowSheet(false)}
            fullWidth
          />
        }
      >
        <Text style={styles.body}>Gorhom bottom sheet wrapper.</Text>
      </BottomSheet>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      color: theme.colors.text,
      ...theme.typography.label,
    },
    wrap: {
      flexWrap: 'wrap',
    },
    alignCenter: {
      alignItems: 'center',
    },
    body: {
      color: theme.colors.text,
      ...theme.typography.bodySm,
    },
  });
